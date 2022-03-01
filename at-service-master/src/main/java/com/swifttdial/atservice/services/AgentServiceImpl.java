package com.swifttdial.atservice.services;

import com.swifttdial.atservice.domains.Agent;
import com.swifttdial.atservice.domains.User;
import com.swifttdial.atservice.repositories.AgentRepository;
import com.swifttdial.atservice.repositories.UserRepository;
import com.swifttdial.atservice.utils.exceptions.BadRequestRestApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class AgentServiceImpl implements AgentService {

    private final AgentRepository agentRepository;
    private final UserRepository userRepository;

    public AgentServiceImpl(AgentRepository agentRepository, UserRepository userRepository) {
        this.agentRepository = agentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Agent createAgent(Agent agent) {
        User user = userRepository.findByPublicId(agent.getUser().getPublicId())
                .orElseThrow(() ->
                        new BadRequestRestApiException()
                                .developerMessage("Sorry. Agent must be a user.")
                                .userMessage("Sorry. Agent must be a user."));

        log.error("*********");
        log.error(user.toString());

        agent.setUser(user);
        agent.setTenant(user.getTenant());

        if (agent.getPhoneNumber().isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Sorry, Phone number must not be empty.")
                    .userMessage("Sorry,Phone number must not be empty.");
        return agentRepository.save(agent);
    }

    @Override
    public Agent fetchByPublicId(UUID publicId) {
        return validate(publicId);
    }

    @Override
    public Agent fetchByUserId(UUID userPublicId) {
        return agentRepository.findByUserPublicId(userPublicId)
                .orElseThrow(() ->
                        new BadRequestRestApiException()
                                .developerMessage("Sorry, agent not found.")
                                .userMessage("Sorry, agent not found.")
                );
    }

    @Override
    public Page<Agent> fetchByTenant(UUID tenant, Pageable pageable) {
        return agentRepository.findAllByTenant(tenant, pageable);
    }

    @Override
    public List<Agent> fetchByTenant(UUID tenant) {
        return agentRepository.findAllByTenant(tenant);
    }

    @Override
    public Agent updateAgent(UUID publicId, Agent updatedAgent) {
        Agent agent = validate(publicId);
        if (!agent.getPublicId().equals(updatedAgent.getPublicId())) {
            throw new BadRequestRestApiException()
                    .developerMessage("Sorry, agent not updatable.")
                    .userMessage("Sorry, agent not updatable.");
        }
        updatedAgent.setId(agent.getId());
        updatedAgent.setVersion(agent.getVersion());
        return agentRepository.save(updatedAgent);
    }

    @Override
    public void deleteAgent(UUID publicId) {
        agentRepository.findByPublicId(publicId).ifPresent(agent -> {
            agent.setDeleted(true);
            agentRepository.save(agent);
        });
    }

    private Agent validate(UUID publicId) {
        return agentRepository.findByPublicId(publicId)
                .orElseThrow(() ->
                        new BadRequestRestApiException()
                                .developerMessage("Sorry, agent not found.")
                                .userMessage("Sorry, agent not found.")
                );
    }
}
