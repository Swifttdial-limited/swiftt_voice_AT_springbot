package com.swifttdial.atservice.services;

import com.africastalking.VoiceService;
import com.africastalking.voice.CallResponse;
import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import com.swifttdial.atservice.datatypes.CallDirection;
import com.swifttdial.atservice.datatypes.IvrOptionType;
import com.swifttdial.atservice.domains.*;
import com.swifttdial.atservice.domains.dto.CallCountTotalDto;
import com.swifttdial.atservice.domains.dto.CallDto;
import com.swifttdial.atservice.domains.dto.MakeCallDTO;
import com.swifttdial.atservice.domains.dto.cdr.Cdr;
import com.swifttdial.atservice.repositories.CallDetailRepository;
import com.swifttdial.atservice.repositories.CallRepository;
import com.swifttdial.atservice.repositories.IvrOptionRepository;
import com.swifttdial.atservice.utils.at.ActionBuilder;
import com.swifttdial.atservice.utils.at.actions.*;
import com.swifttdial.atservice.utils.converters.CallDtoToCallConverter;
import com.swifttdial.atservice.utils.converters.CallDtoToCallDetailConverter;
import com.swifttdial.atservice.utils.exceptions.BadRequestRestApiException;
import com.swifttdial.atservice.utils.exceptions.InternalServerErrorRestApiException;
import com.swifttdial.atservice.utils.exceptions.ResourceNotFoundRestApiException;
import com.swifttdial.atservice.utils.formatters.DateFormatter;
import com.swifttdial.atservice.utils.validators.Validators;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.function.Supplier;
import java.util.stream.Stream;

@Slf4j
@Service
public class CallServiceImpl implements CallService {

    private final VoiceService atVoiceService;
    private final IvrService ivrService;
    private final AgentService agentService;

    private final CallRepository callRepository;
    private final CallDetailRepository callDetailRepository;
    private final IvrOptionRepository  ivrOptionRepository;

    private final CallDtoToCallConverter callDtoToCallConverter;
    private final CallDtoToCallDetailConverter dtoToCallDetailConverter;

    private final PhoneNumberUtil phoneNumberUtil =  PhoneNumberUtil.getInstance();

    public CallServiceImpl(VoiceService atVoiceService, IvrService ivrService, AgentService agentService, CallRepository callRepository, CallDetailRepository callDetailRepository, IvrOptionRepository ivrOptionRepository, CallDtoToCallConverter callDtoToCallConverter, CallDtoToCallDetailConverter dtoToCallDetailConverter) {
        this.atVoiceService = atVoiceService;
        this.ivrService = ivrService;
        this.agentService = agentService;
        this.callRepository = callRepository;
        this.callDetailRepository = callDetailRepository;
        this.ivrOptionRepository = ivrOptionRepository;
        this.callDtoToCallConverter = callDtoToCallConverter;
        this.dtoToCallDetailConverter = dtoToCallDetailConverter;
    }

    @Override
    public Call fetchByPublicId(UUID publicId) {
        return validate(publicId);
    }

    @Override
    public Page<Call> fetchSorted(Pageable pageable) {
        return callRepository.findAll(pageable);
    }

    @Override
    public Page<Call> fetchSortedTenantCalls(UUID tenant, String startDate, String endDate, String date, Pageable pageable) {
        if (Validators.allNotEqualNull(date) && Validators.allEqualNull(startDate, endDate)) {
            return callRepository.findByTenantAndCreatedDate(tenant, DateFormatter.getMinDateTime(date), pageable);
        } else if (Validators.allNotEqualNull(startDate) && Validators.allEqualNull(date, endDate)) {
            return callRepository.findByTenantAndCreatedDateBefore(tenant, DateFormatter.getMinDate(startDate), pageable);
        } else if (Validators.allNotEqualNull(endDate) && Validators.allEqualNull(startDate, date)) {
            return callRepository.findByTenantAndCreatedDateAfter(tenant, DateFormatter.getMinDateTime(endDate), pageable);
        } else if (Validators.allNotEqualNull(startDate, endDate) && Validators.allEqualNull(date)) {
            return callRepository.findByTenantAndCreatedDateBetween(tenant, DateFormatter.getMinDateTime(startDate),
                    DateFormatter.getMaxDateTime(endDate), pageable);
        } else
            return callRepository.findAllByTenant(tenant, pageable);
    }

    @Override
    public Call update(UUID publicId, Call call) {
        Call instituteCall = validate(publicId);
        if (!instituteCall.getId().equals(call.getId())) {
            throw new BadRequestRestApiException()
                    .developerMessage("The details sent do not match.")
                    .userMessage("Sorry. The details sent do not match.");
        }
        return callRepository.save(call);
    }

    @Override
    public void delete(UUID publicId) {
        callRepository.findByPublicId(publicId)
                .ifPresent(ivr -> {
                    ivr.setDeleted(true);
                    callRepository.save(ivr);
                });
    }

    Call validate(UUID publicId) {
        return callRepository.findByPublicId(publicId)
                .orElseThrow(() ->
                        new ResourceNotFoundRestApiException()
                                .developerMessage("Call " + publicId.toString() + " was not found")
                                .userMessage("Sorry, the call was not found."));
    }

    @Override
    public void makeCall(MakeCallDTO makeCallDTO) {
        if (makeCallDTO.getFrom().isEmpty() || makeCallDTO.getFrom() == null)
            makeCallDTO.setFrom("+254711082027");
        CallResponse call = null;
        try {
            call = atVoiceService.call(makeCallDTO.getTo(), makeCallDTO.getFrom());
        } catch (IOException e) {
            e.printStackTrace();
            throw new InternalServerErrorRestApiException()
                    .developerMessage("Sorry. Error occurred while making call.")
                    .userMessage("Sorry. Error occurred while making call.");
        }
        log.error(call.toString());
    }

    /**
     * Process an incoming call.
     * Step 1: Fetch IVR using the tenant passed.
     * Step 2: Check is Ivr is null. If null throw an {@code InternalServerErrorRestApiException}.
     * Step 3: Check if the call session exists before. If does not exist save the new call.
     * Step 4. Get the call details for the call.
     * Step 5: Check if the call is active (ongoing). If not save the amount and duration.
     * Step 5.1: Process inbound calls.
     * Step 5.1.2
     * @param callDto
     * @param institutionPublicId
     * @param level
     * @return
     */
    @Override
    public String handleCall(CallDto callDto, UUID institutionPublicId, int level) {

        log.error("$$$$$$$$");
        log.error(callDto.toString());
        log.error("**** " + level);

        Ivr ivr = ivrService.fetchByTenant(institutionPublicId);

        if (Objects.equals(ivr, null))
            throw new InternalServerErrorRestApiException()
                    .developerMessage("Sorry.Ivr not set up.")
                    .userMessage("Sorry. Ivr not set up.");

        Optional<Call> callOptional = callRepository.findBySessionId(callDto.getSessionId());

        Call call = null;
        CallDetail callDetail = null;

        if (callOptional.isPresent()) {
            call = callOptional.get();
        } else {
            Call newCall = callDtoToCallConverter.convert(callDto);
            newCall.setTenant(institutionPublicId);
            call = callRepository.save(newCall);
        }
        callDetail = dtoToCallDetailConverter.convert(callDto);
        callDetail.setTenant(institutionPublicId);
        callDetail.setCall(call);
//        callDetail = callDetailRepository.save(callDetail);

        List<CallDetail> previousCallDetails = callDetailRepository.findAllByCall(call);
        List<IvrOption> ivrOptionList = ivr.getOptions();
//        List<IvrOption> ivrOptionList = ivrOptionRepository.findByIvrAndLevel(ivr,level);

        log.info("&&&&&&&&&&&&&&&&");
        log.info("Previous Call Details");
        log.info(Arrays.toString(previousCallDetails.toArray()));
        log.info("Ivr Options");
        log.info(Arrays.toString(ivrOptionList.toArray()));
        log.info("&&&&&&&&&&&&&&&&");

        //Get Institution and Ivr
        if (callDto.getIsActive().contentEquals("1")) {
            if (callDto.getDirection().equals(CallDirection.Inbound)) {
                Supplier<Stream<IvrOption>> ivrOptions = () -> ivrOptionList.stream().filter(option -> {

                    if (previousCallDetails.size() > 0){
                        previousCallDetails.sort((o1, o2) ->
                                (int) (o1.getId() - o2.getId()));
                    }

                    if (previousCallDetails.size() > 0 && level!= 0 && previousCallDetails.get(previousCallDetails.size() - 1).getIvrOption() != null) {
                        return option.getLevel() == level && option.getParent().equals(previousCallDetails.get(previousCallDetails.size() - 1).getIvrOption());
                    } else {
                        return option.getLevel() == level;
                    }
                });

                if (ivrOptions.get().count() >= 1) {

                    IvrOption ivrOption = null;

                    if (level == 0) {
                        if (ivrOptions.get().count() == 1) {
                            ivrOption = ivrOptions.get().findFirst().get();
                        } else {
                            throw new InternalServerErrorRestApiException()
                                    .developerMessage("Sorry.Ivr options not correctly set up.")
                                    .userMessage("Sorry. Ivr options not correctly set up.");
                        }
                    } else {
                        ivrOption = ivrOptions.get().filter(ivrOption1 -> ivrOption1
                                .getDtmfDigits().contentEquals(callDto.getDtmfDigits()))
                                .findFirst()
                                .orElseThrow(() ->
                                        new InternalServerErrorRestApiException()
                                                .developerMessage("Sorry.Ivr options not correctly set up.")
                                                .userMessage("Sorry. Ivr options not correctly set up."));

                        //todo check for one option after filter
                    }

                    callDetail.setIvrOption(ivrOption);
                    callDetailRepository.save(callDetail);

                    if (ivrOption.getType().equals(IvrOptionType.PLAY_AUDIO) ||
                            ivrOption.getType().equals(IvrOptionType.BEYOND_WORKING_HOURS) ||
                            ivrOption.getType().equals(IvrOptionType.NO_AVAILABLE_AGENT)) {
                        ActionBuilder builder = new ActionBuilder();

                        if (ivrOption.getAudioUrl() == null || ivrOption.getAudioUrl().toString().isEmpty()) {
                            builder.getDigits(new GetDigits(
                                    new Say(ivrOption.getAudioMessage()),
                                    0,
                                    null,
                                    ivr.getCallback(ivrOption),
                                    2
                            ))
                                    .redirect(new Redirect(ivr.getInitialUrl()));
                        } else {
                            builder.getDigits(new GetDigits(
                                    new Play(ivrOption.getAudioUrl()),
                                    0,
                                    null,
                                    ivr.getCallback(ivrOption),
                                    2
                            ))
                                    .redirect(new Redirect(ivr.getInitialUrl()));
                        }

                        return builder.build();
                    } else {

                        List<String> agents = new ArrayList<>();
//                        agents.add("agent4.getso@ke.sip.africastalking.com");
//                        agents.add("agent3.getso@ke.sip.africastalking.com");

                        Stream<Agent> agentStream = agentService.fetchByTenant(institutionPublicId)
                                .stream()
                                .filter(Agent::isEnabled);

                        agentStream.forEach(agent -> agents.add(agent.getPhoneNumber()));

                        if (agents.isEmpty())
                            return new ActionBuilder()
                                    .say(new Say(
                                            "All our agents are currently busy. Please try again later.",
                                            true
                                    )).build();

                        return new ActionBuilder()
                                .dial(new Dial(
                                        agents,
                                        true,
                                        false,
                                        null,
                                        ivrOption.getAudioUrl(),
                                        0
                                )).build();
                    }
                } else {
                    throw new InternalServerErrorRestApiException()
                            .developerMessage("Sorry. Wrong option selected.")
                            .userMessage("Sorry. Wrong option selected.");
                }


                /*if (ivrOptions.get().count() == 1) {
                    ivrOption = ivrOptions.get().findFirst()
                            .orElseThrow(() ->
                                    new InternalServerErrorRestApiException()
                                            .developerMessage("Sorry.Ivr options not correctly set up.")
                                            .userMessage("Sorry. Ivr options not correctly set up."));
                } else if (ivrOptions.get().count() > 1) {
                    ivrOption = ivrOptions.get().filter(ivrOption1 -> ivrOption1
                            .getDtmfDigits().contentEquals(callDto.getDtmfDigits()))
                            .findFirst()
                            .orElseThrow(() ->
                                    new InternalServerErrorRestApiException()
                                            .developerMessage("Sorry.Ivr options not correctly set up.")
                                            .userMessage("Sorry. Ivr options not correctly set up."));
                } else {
                    throw new InternalServerErrorRestApiException()
                            .developerMessage("Sorry.Ivr options not correctly set up.")
                            .userMessage("Sorry. Ivr options not correctly set up.");
                }

                if (ivrOption.getType().equals(IvrOptionType.PLAY_AUDIO) ||
                        ivrOption.getType().equals(IvrOptionType.BEYOND_WORKING_HOURS) ||
                        ivrOption.getType().equals(IvrOptionType.NO_AVAILABLE_AGENT)) {
                    ActionBuilder builder = new ActionBuilder();

                    if (ivrOption.getAudioUrl() == null || ivrOption.getAudioUrl().toString().isEmpty()){
                        builder.getDigits(new GetDigits(
                                        new Say(ivrOption.getAudioMessage()),
                                        0,
                                        null,
                                        ivr.getCallback(ivrOption),
                                        2
                                ))
                                .redirect(new Redirect(ivr.getInitialUrl()));
                    } else {
                        builder.getDigits(new GetDigits(
                                        new Play(ivrOption.getAudioUrl()),
                                        0,
                                        null,
                                        ivr.getCallback(ivrOption),
                                        2
                                ))
                                .redirect(new Redirect(ivr.getInitialUrl()));
                    }

                    return builder.build();
                } else {
                    List<String> agents = new ArrayList<>();
                    agents.add("agent4.getso@ke.sip.africastalking.com");
                    agents.add("agent3.getso@ke.sip.africastalking.com");

                    return new ActionBuilder()
                            .dial(new Dial(
                                    agents,
                                    true,
                                    false,
                                    null,
                                    ivrOption.getAudioUrl(),
                                    0
                            )).build();
                }*/
            } else {
                if (ivr.getPhoneNumber().isEmpty())
                    throw new InternalServerErrorRestApiException()
                            .developerMessage("Sorry. Ivr phone number not configured.")
                            .userMessage("Sorry. Ivr phone number not configured.");

                String phoneNumber = getParsedPhoneNumber(callDto.getCallerNumber());

                List<String> agents = new ArrayList<>();
                agents.add(phoneNumber);

                return new ActionBuilder()
                        .dial(new Dial(agents,
                                true,
                                false,
                                ivr.getPhoneNumber(),
                                null,
//                                new URL("http://swifttdial.com/callcentre/call_center_ringing.mp3"),
                                0
                        )).build();
            }
        } else {
            call.setAmount(callDto.getAmount());
            call.setDurationInSeconds(callDto.getDurationInSeconds());
            call.setCallSessionState(callDto.getCallSessionState());
            call.setStatus(callDto.getStatus());
            call.setCurrencyCode(callDto.getCurrencyCode());
            call.setRecordingUrl(callDto.getRecordingUrl());
            call.setDialDestinationNumber(callDto.getDialDestinationNumber());
            call.setDialStartTime(callDto.getDialStartTime());
            call.setDialDurationInSeconds(callDto.getDialDurationInSeconds());

            callRepository.save(call);

            return new ActionBuilder()
                    .complete(new Complete(
                            true,
                            call.getSessionId()
                    )).build();
        }
    }

    @Override
    public CallCountTotalDto callCountTotals(UUID tenant) {
        CallCountTotalDto callCountTotalDto = new CallCountTotalDto();
        callCountTotalDto.setCallCountByDirection(callRepository.countTotalCallsByDirection(tenant));
        callCountTotalDto.setCallCountBySessionState(callRepository.countTotalCallsBySessionState(tenant));
        callCountTotalDto.setCallCountByStatus(callRepository.countTotalCallsByStatus(tenant));
        callCountTotalDto.setCallByAgents(callRepository.fetchCallsByAgent(tenant));
        return callCountTotalDto;
    }

    @Override
    public void handleCallCdr(Cdr cdr) {
        log.error(cdr.toString());
    }

    public Phonenumber.PhoneNumber parsePhoneToKenyan(String phoneNo) throws NumberParseException {
        return phoneNumberUtil.parse(phoneNo, "KE");
    }

    public String getParsedPhoneNumber(Phonenumber.PhoneNumber phoneNumber){
        return phoneNumberUtil.format(phoneNumber, PhoneNumberUtil.PhoneNumberFormat.E164);
    }

    public String getParsedPhoneNumber(String phoneNumber) {
        try {
            return getParsedPhoneNumber(parsePhoneToKenyan(phoneNumber));
        } catch (NumberParseException e) {
            e.printStackTrace();
            return phoneNumber;
        }
    }
}
