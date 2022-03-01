package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.swifftdial.identityservice.datatypes.Gender;
import com.swifftdial.identityservice.datatypes.MaritalStatus;
import com.swifftdial.identityservice.datatypes.UserType;
import com.swifftdial.identityservice.domains.vo.Country;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Where;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@Table(schema = "systemusers", name = "users")
@Where(clause = "deleted =false")
public class User extends BaseEntity {

    @JsonView({Role.Full.class, User.Full.class})
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    @NotNull(groups = UpdateView.class)
    private Long id;

    @JsonView({Role.Full.class, User.Full.class})
    @Version
    @Column(name = "user_version")
    @NotNull(groups = UpdateView.class)
    private Long version;

    @JsonView({CreatePatientView.class, User.Full.class, ProfileView.class})
    @JoinColumn(name = "user_title_id_fk")
    @ManyToOne
    private Title title;

    @JsonView({CreatePatientView.class, User.Full.class, ProfileView.class})
    @JoinColumn(name = "user_region_id_fk")
    @ManyToOne
    private Region region;

    @JsonView({CreatePatientView.class, User.Full.class, ProfileView.class})
    @NotNull
    @Column(name = "user_firstname")
    private String firstName;

    @JsonView({CreatePatientView.class, User.Full.class, ProfileView.class})
    @NotNull
    @Column(name = "user_surname")
    private String surname;

    @JsonView({CreatePatientView.class, User.Full.class, ProfileView.class})
    @Column(name = "user_othernames")
    private String otherNames;

    @JsonView({CreatePatientView.class})
    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Column(name = "user_dateofbirth")
    private Date dateOfBirth;

    @JsonView({CreatePatientView.class})
    @Column(name = "user_gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @JsonView(LoginView.class)
    @Column(name = "user_password")
    private String password;

    @Column(name = "user_phonenumber")
    @JsonView({Role.Full.class, Summary.class, ViewUser.class, CreatePatientView.class, Full.class})
    private String phoneNumber;

    @JsonView(CreatePatientView.class)
    @Column(name = "user_description")
    private String description;

    @Column(name = "user_isapproved")
    @ColumnDefault(value = "false")
    private boolean isApproved;

    @JsonView({Full.class, ViewUser.class})
    @Column(name = "user_phonenumberverified")
    private boolean phoneNumberVerified;

    @JsonIgnore
    @Column(name = "user_phonenumberverificationcode")
    private Integer phoneNumberVerificationCode;

    @JsonIgnore
    @Column(name = "user_phonenumberverificationcodevalid")
    private boolean phoneNumberVerificationCodeValid;

    @Column(name = "user_emailaddress")
    @JsonView({Role.Full.class, Full.class, Summary.class, TokenView.class, UserSpecialization.SummaryView.class, ViewUser.class, CreatePatientView.class})
    private String emailAddress;

    @JsonView(CreatePatientView.class)
    @Embedded
    private Country countryOfOrigin;

    @JsonIgnore
    @Column(name = "user_emailaddressverificationcode")
    private String emailAddressVerificationCode;

    @JsonIgnore
    @Column(name = "user_emailaddressverificationcodevalid")
    private boolean emailAddressVerificationCodeValid;

    @JsonIgnore
    @Column(name = "user_emailaddressverified")
    private boolean emailAddressVerified;

    @Column(name = "user_physicaladdress")
    @JsonView({ViewUser.class, CreatePatientView.class})
    private String physicalAddress;

    @JsonView({LoginView.class, Role.Full.class, Full.class, Summary.class, UserSpecialization.SummaryView.class, ProfileView.class})
    @Column(name = "user_username", updatable = false)
    private String username;

    @Column(name = "user_number")
    private String userNumber;

    @Column(name = "user_comment")
    @JsonView({Summary.class, ViewUser.class})
    private String comment;

    @JsonView(LoginView.class)
    @Column(name = "user_forcepasswordreset")
    private boolean forcePasswordReset;

    @JsonView({LoginView.class, Role.Full.class, Summary.class})
    @Column(name = "user_enabled", nullable = false, updatable = false)
    private boolean enabled;

    @JsonView(LoginView.class)
    @Column(name = "user_accountnonlocked", nullable = false, updatable = false)
    private boolean accountNonLocked;

    @JsonView(LoginView.class)
    @Column(name = "user_accountnonexpired", nullable = false, updatable = false)
    private boolean accountNonExpired;

    @JsonView(LoginView.class)
    @Column(name = "user_credentialsnonexpired", nullable = false, updatable = false)
    private boolean credentialsNonExpired;

    @JsonView({Summary.class, UserSpecialization.SummaryView.class, ViewUser.class})
    @Column(name = "user_outofoffice")
    private boolean outOfOffice = false;

    @JsonIgnore
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "user_outofofficestartdate")
    private Date outOfOfficeStartDate;

    @JsonIgnore
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "user_outofofficeenddate")
    private Date outOfOfficeEndDate;

    @JsonView({ViewUser.class})
    @Column(name = "user_outofofficedescription")
    private String outOfOfficeDescription;

    @JsonView({ViewUser.class})
    @Transient
    private String outOfOfficeDuration;

    @Column(name = "user_mobileapplicationactivated")
    private boolean mobileApplicationActivated = false;

    @Column(name = "user_mobileapplicationactivationcode")
    private String mobileApplicationActivationCode;

    @JsonView({TokenView.class})
    @Column(name = "user_fcmtoken")
    private String fcmToken;

    @JsonView({Full.class, LoginView.class})
    @ManyToMany//(cascade = CascadeType.MERGE)
    @JoinTable(name = "user_roles", schema = "systemusers",
            joinColumns = @JoinColumn(name = "user_id_fk", referencedColumnName = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id_fk", referencedColumnName = "role_id"))
    private Collection<Role> roles = new ArrayList<>();

    @JsonView(CreatePatientView.class)
    @Transient
    private List<UserIdentification> identifications = new ArrayList<>();

    @Transient
    @JsonView({LoginView.class, ProfileView.class, Summary.class, TokenView.class, UserSpecialization.SummaryView.class, ViewUser.class})
    private String fullName;

    @JsonView(CreatePatientView.class)
    @Column(name = "user_maritalstatus")
    @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus;

    @Transient
    @JsonView({ViewUser.class, CreatePatientView.class})
    private UserType userType;

    @JsonView({CreatePatientView.class})
    @JoinColumn(name = "user_religion_id_fk")
    @ManyToOne
    private Religion religion;

    // update constructor
    public User(Long id, String firstName, String surname, String otherNames) {
        this.id = id;
        this.firstName = firstName;
        this.surname = surname;
        this.otherNames = otherNames;
    }

    public String getFullName() {
        StringBuilder sb = new StringBuilder();
        sb.append(firstName).append(" ").append(surname);
        if (otherNames != null)
            sb.append(" ").append(otherNames);
        return sb.toString();
    }

    public String getOutOfOfficeDuration() {
        if (outOfOfficeStartDate != null && outOfOfficeEndDate != null) {
            StringBuilder sb = new StringBuilder();
            sb.append("Start Date ").append(outOfOfficeStartDate).append(" End Date ").append(outOfOfficeEndDate);
            return sb.toString();
        } else
            return null;
    }

    public void setPassword(String password) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        this.password = passwordEncoder.encode(password);
    }

    public boolean matchPassword(String currentPassword) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(currentPassword, this.password);
    }

    public void addRole(Role role) {
        roles.add(role);
    }

    public void removeRole(Role role) { roles.remove(role); }

    @PrePersist
    public void prePersist() {
        //TODO Generate a user number here
        this.accountNonLocked = true;
        this.accountNonExpired = true;
        this.credentialsNonExpired = true;
        this.enabled = true;
        this.phoneNumberVerified = false;
        this.phoneNumberVerificationCodeValid = false;
        super.prePersist();
    }
    
    public interface ProfileView {}

    public interface ViewUser {}

    public interface Summary {}

    public interface Full extends Summary {}

    public interface LoginView {}

    public interface UpdateView {}

    public interface TokenView {}

    public interface CreatePatientView{}
}