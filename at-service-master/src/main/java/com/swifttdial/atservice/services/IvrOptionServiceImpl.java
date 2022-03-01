package com.swifttdial.atservice.services;

import com.swifttdial.atservice.domains.Ivr;
import com.swifttdial.atservice.domains.IvrOption;
import com.swifttdial.atservice.repositories.IvrOptionRepository;
import com.swifttdial.atservice.repositories.IvrRepository;
import com.swifttdial.atservice.utils.exceptions.BadRequestRestApiException;
import com.swifttdial.atservice.utils.exceptions.ResourceNotFoundRestApiException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@Service
public class IvrOptionServiceImpl implements IvrOptionService {

    private final IvrService ivrService;

    private final IvrOptionRepository ivrOptionRepository;
    private final IvrRepository ivrRepository;

    public IvrOptionServiceImpl(IvrService ivrService, IvrOptionRepository ivrOptionRepository, IvrRepository ivrRepository) {
        this.ivrService = ivrService;
        this.ivrOptionRepository = ivrOptionRepository;
        this.ivrRepository = ivrRepository;
    }

    @Override
    public IvrOption create(IvrOption ivrOption) {
        Ivr ivr = ivrRepository.findByTenant(ivrOption.getTenant())
                .orElseGet(() -> {
                    Ivr newIvr = new Ivr();
                    newIvr.setTenant(ivrOption.getTenant());
                    return ivrService.create(newIvr);
                });
        ivrOption.setIvr(ivr);
        IvrOption savedIvrOption =  ivrOptionRepository.save(ivrOption);

        savedIvrOption.setLevel(calculateLevel(savedIvrOption, 0));

        return ivrOptionRepository.save(savedIvrOption);
    }

    @Override
    public IvrOption fetchByPublicId(UUID publicId) {
        return validate(publicId);
    }

    @Override
    public Page<IvrOption> fetchAllByTenantPage(UUID tenant, Pageable pageable) {
        return ivrOptionRepository.findByTenant(tenant, pageable);
    }

    @Override
    public IvrOption update(UUID publicId, IvrOption ivrOption) {
        IvrOption option = validate(publicId);
        if (!Objects.equals(option.getId(), ivrOption.getId())) {
            throw new BadRequestRestApiException()
                    .developerMessage("The details do not match.")
                    .userMessage("Sorry. The details do not match.");
        }
        return ivrOptionRepository.save(ivrOption);
    }

    @Override
    public void delete(UUID publicId) {
        ivrOptionRepository.findByPublicId(publicId)
                .ifPresent(ivrOption -> {
                    ivrOption.setDeleted(true);
                    ivrOptionRepository.findByParent(ivrOption).forEach(ivrOption1 -> {
                        ivrOption1.setDeleted(true);
                        ivrOptionRepository.save(ivrOption1);
                    });
                    ivrOptionRepository.save(ivrOption);
                });
    }

    public IvrOption validate(UUID publicId) {
        return ivrOptionRepository.findByPublicId(publicId)
                .orElseThrow(() ->
                        new ResourceNotFoundRestApiException()
                                .developerMessage("The Ivr option { " + publicId + " } was not found.")
                                .userMessage("Sorry. The Ivr option was not found."));
    }

    private int calculateLevel(IvrOption option, int level){
        if (option.getParent() != null){
            level = level + 1;
            return calculateLevel(option.getParent(), level);
        } else {
            return level;
        }
    }
}
