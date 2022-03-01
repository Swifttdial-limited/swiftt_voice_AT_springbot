package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.repositories.TitleRepository;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.utils.exceptions.ResourceNotFoundRestApiException;
import com.swifftdial.identityservice.domains.Title;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Created by gathigai on 12/17/16.
 */
@Service
public class TitleServiceImpl implements TitleService {

    private final TitleRepository titleRepository;

    @Autowired
    public TitleServiceImpl(TitleRepository titleRepository) {
        this.titleRepository = titleRepository;
    }

    @Override
    public Title createTitle(Title newTitle) {
        if(!titleRepository.findByTenantAndNameIgnoreCase(newTitle.getTenant(), newTitle.getName()).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Duplicate title exists.")
                    .userMessage("Sorry. Duplicate title exists");

        return titleRepository.save(newTitle);
    }

    @Override
    public Page<Title> fetchTitles(UUID tenant, Pageable pageable) {
        return titleRepository.findByTenant(tenant, pageable);
    }

    @Override
    public Title updateTitle(UUID tenant, UUID titlePublicId, Title updatedTitle) {
        this.validate(tenant, titlePublicId);

        if(!titleRepository.findByTenantAndNameIgnoreCaseAndIdNot(
                tenant, updatedTitle.getName(), updatedTitle.getId()).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Duplicate title exists.")
                    .userMessage("Sorry. Duplicate title exists");

        return titleRepository.save(updatedTitle);
    }

    @Override
    public void deleteTitle(UUID tenant, UUID titlePublicId) {
        Optional<Title> foundTitle = titleRepository.findByTenantAndPublicId(tenant, titlePublicId);

        if(foundTitle.isPresent()) {
            foundTitle.get().setDeleted(true);
            titleRepository.save(foundTitle.get());
        }
    }

    @Override
    public Page<Title> searchTitle(UUID tenant, String name, Pageable pageable) {
        return titleRepository.findByTenantAndNameIgnoreCase(tenant, name, pageable);
    }

    @Override
    public List<Title> fetchTitles(UUID tenant) {
        return titleRepository.findByTenant(tenant);
    }

    @Override
    public Title validate(UUID tenant, UUID titlePublicId) {
        return titleRepository.findByTenantAndPublicId(tenant, titlePublicId)
                .orElseThrow(() -> new ResourceNotFoundRestApiException()
                        .developerMessage("Title not found")
                        .userMessage("Sorry. Title does not exist"));
    }

}
