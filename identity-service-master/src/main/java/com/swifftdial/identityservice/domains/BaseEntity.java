package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.data.annotation.CreatedBy;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    // TODO JsonIgnore
    @JsonView(User.LoginView.class)
    @Column(name = "tenant", updatable = false)
    private UUID tenant;

    @JsonView({OrganogramNode.View.class, Role.Summary.class, User.LoginView.class, UserSpecialization.SummaryView.class, User.Summary.class})
    @Column(name = "public_id", unique = true, updatable = false)
    private UUID publicId;

    @JsonView({Role.Summary.class, User.Summary.class})
    @Column(name = "modifiable", columnDefinition = "boolean default false")
    private boolean modifiable;

    @Column(name = "deleted", columnDefinition = "boolean default false")
    private boolean deleted;

    @Column(name = "synced", columnDefinition = "boolean default false")
    private boolean synced;

    @JsonIgnore
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    @Column(name = "create_date", updatable = false)
    private Date createdDate;

    @JsonIgnore
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    @Column(name = "update_date", insertable = false)
    private Date updateDate;

    @JsonIgnore
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    @Column(name = "delete_date", insertable = false)
    private Date deleteDate;

    @JsonIgnore
    @Column(name = "created_by")
    @CreatedBy
    private Long createdBy;

    @JsonIgnore
    @Column(name = "updated_by")
    private Long updatedBy;

    @JsonIgnore
    @Column(name = "deleted_by")
    private UUID deletedBy;

    @PrePersist
    public void prePersist() {
        this.publicId = UUID.randomUUID();
        this.createdDate = new Date();
        updateDate  = new Date();
        deleted = false;
        synced = false;
    }

    @PreUpdate
    public void preUpdate() {
        this.updateDate = new Date();
    }
}