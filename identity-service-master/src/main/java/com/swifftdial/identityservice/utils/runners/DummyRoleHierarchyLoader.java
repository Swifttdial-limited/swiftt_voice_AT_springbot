package com.swifftdial.identityservice.utils.runners;

import com.swifftdial.identityservice.domains.Actor;
import com.swifftdial.identityservice.domains.Role;
import com.swifftdial.identityservice.repositories.ActorRepository;
import com.swifftdial.identityservice.repositories.OrganogramNodeRepository;
import com.swifftdial.identityservice.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;

//@Component
//@Order(99999)
public class DummyRoleHierarchyLoader implements CommandLineRunner {

    private final ActorRepository actorRepository;
    private final OrganogramNodeRepository organogramNodeRepository;
    private final RoleRepository roleRepository;

    public DummyRoleHierarchyLoader(ActorRepository actorRepository, OrganogramNodeRepository organogramNodeRepository,
                                    RoleRepository roleRepository) {
        this.actorRepository = actorRepository;
        this.organogramNodeRepository = organogramNodeRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        //roleRepository.deleteAll();
        //actorRepository.deleteAll();

        Actor ceoActor = new Actor();
        ceoActor.setName("Chief Executive Officer");
        ceoActor = actorRepository.save(ceoActor);

        Role ceoRole = new Role("Role_CEO", ceoActor);
        ceoRole = roleRepository.save(ceoRole);

        Actor procManActor = new Actor();
        procManActor.setName("Procurement Manager");
        procManActor = actorRepository.save(procManActor);

        Role procManRole = new Role("Role_Proc_Manager", procManActor);
        procManRole = roleRepository.save(procManRole);

        Actor finManActor = new Actor();
        finManActor.setName("Finance Manager");
        finManActor = actorRepository.save(finManActor);

        Role finManRole = new Role("Role_Finance_Manager", finManActor);
        finManRole = roleRepository.save(finManRole);

        Actor accountantActor = new Actor();
        accountantActor.setName("Accountant");
        accountantActor = actorRepository.save(accountantActor);

        Role accountantRole = new Role("Role_Accountant", accountantActor);
        accountantRole = roleRepository.save(accountantRole);

        Actor internActor = new Actor();
        internActor.setName("Intern");
        internActor = actorRepository.save(internActor);

        Role accountsInternRole = new Role("Role_Accounts_Intern", internActor);
        accountsInternRole = roleRepository.save(accountsInternRole);

//        OrganogramNode cEONode = new OrganogramNode(ceoRole);
//        organogramNodeRepository.save(cEONode);
//
//        OrganogramNode procManNode = new OrganogramNode(procManRole, ceoRole);
//        organogramNodeRepository.save(procManNode);
//
//        OrganogramNode finManNode = new OrganogramNode(finManRole, ceoRole);
//        organogramNodeRepository.save(finManNode);
//
//        OrganogramNode accountantNode = new OrganogramNode(accountantRole, finManRole);
//        organogramNodeRepository.save(accountantNode);
//
//        OrganogramNode accountsInternNode = new OrganogramNode(accountsInternRole, finManRole);
//        organogramNodeRepository.save(accountsInternNode);
    }
}
