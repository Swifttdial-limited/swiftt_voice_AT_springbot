package com.swifttdial.atservice.domains;

import lombok.*;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "ivr", name = "ivr")
@Where(clause = "deleted = false")
public class Ivr extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(name = "ivr_description")
    private String description;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ivr", fetch = FetchType.LAZY)
    private List<IvrOption> options = new ArrayList<>();

    private URL initialUrl;

    private String phoneNumber;

    public URL getCallback(IvrOption option){
        String url = initialUrl.toString() + "/" + (option.getLevel() + 1);
        try {
            return new URL(url);
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return initialUrl;
        }
    }
}
