package com.swifttdial.atservice.domains;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swifttdial.atservice.datatypes.IvrOptionType;
import lombok.*;
import org.hibernate.annotations.Loader;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.jetbrains.annotations.Nullable;

import javax.persistence.*;
import java.net.URL;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "IvrOptions")
@Table(schema = "ivr", name = "ivr_options")
@SQLDelete(sql =
        "UPDATE ivr_options " +
                "SET deleted = true " +
                "WHERE id = ?")
@Loader(namedQuery = "findIvrOptionsById")
@NamedQuery(name = "findIvrOptionsById", query =
        "SELECT io " +
                "FROM IvrOptions io " +
                "WHERE " +
                "  io.id = ?1 AND " +
                "  io.deleted = false")
@Where(clause = "deleted = false")
public class IvrOption extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(name = "ivr_option_description")
    private String description;

    @Nullable
    @Column(name = "ivr_option_audio_url")
    private URL audioUrl;

    @Column(name = "ivr_option_audio_message")
    private String audioMessage;

    @Enumerated(EnumType.STRING)
    @Column(name = "ivr_option_type")
    private IvrOptionType type = IvrOptionType.PLAY_AUDIO;

    @Column(name = "ivr_option_level")
    private int level = 0;

    @ManyToOne
    @JoinColumn(name = "parent_ivr_id_fk")
    private IvrOption parent;

    @Column(name = "ivr_option_dtmf_digits")
    private String dtmfDigits;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ivr_option_ivr", nullable = false)
    private Ivr ivr;

}
