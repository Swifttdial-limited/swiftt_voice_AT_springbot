package com.swifftdial.identityservice.configurations;

import com.swifftdial.identityservice.domains.Country;
import com.swifftdial.identityservice.utils.batch.JobCompletionNotificationListener;
import com.swifftdial.identityservice.domains.Privilege;
import com.swifftdial.identityservice.utils.batch.PrivilegeItemProcessor;
import com.swifftdial.identityservice.utils.batch.PrivilegeItemWriter;
import com.swifftdial.identityservice.utils.batch.country.CountriesJobCompletionNotificationListener;
import com.swifftdial.identityservice.utils.batch.country.CountryItemProcessor;
import com.swifftdial.identityservice.utils.batch.country.CountryItemWriter;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

@Configuration
@EnableBatchProcessing
public class BatchConfiguration {

    public final JobBuilderFactory jobBuilderFactory;
    public final StepBuilderFactory stepBuilderFactory;

    @Autowired
    public BatchConfiguration(JobBuilderFactory jobBuilderFactory, StepBuilderFactory stepBuilderFactory) {
        this.jobBuilderFactory = jobBuilderFactory;
        this.stepBuilderFactory = stepBuilderFactory;
    }

    /**
     * Input of the pipeline. It fetches and reads the contents of csv
     * @return
     */
    @Bean
    public FlatFileItemReader<Privilege> privilegeReader() {
        FlatFileItemReader<Privilege> reader = new FlatFileItemReader<>();
        reader.setResource(new ClassPathResource("swifttdial-privileges-list.csv"));
        reader.setLinesToSkip(1);
        reader.setLineMapper(new DefaultLineMapper<Privilege>() {{
            setLineTokenizer(new DelimitedLineTokenizer() {{
                setNames(new String[] { "privilegeGroup", "code", "name", "description", "global", "assignedByDefault"});
                setDelimiter(":");
            }});
            setFieldSetMapper(new BeanWrapperFieldSetMapper<Privilege>() {{
                setTargetType(Privilege.class);
            }});
        }});
        return reader;
    }

    /**
     * Transformer of the pipeline.
     * @return
     */
    @Bean
    public PrivilegeItemProcessor privilegeItemProcessor() {
        return new PrivilegeItemProcessor();
    }

    /**
     * Output of the pipeline
     * @return
     */
    @Bean
    public PrivilegeItemWriter privilegeItemWriter() {
        return new PrivilegeItemWriter();
    }

    @Bean(name = "importPrivilegesJob")
    public Job importPrivilegesJob(JobCompletionNotificationListener listener) {
        return jobBuilderFactory.get("importPrivilegeFactsJob")
                .incrementer(new RunIdIncrementer())
                .listener(listener)
                .flow(step1())
                .end()
                .build();
    }

    @Bean
    public Step step1() {
        return stepBuilderFactory.get("step1")
                .<Privilege, Privilege> chunk(10)
                .reader(privilegeReader())
                .processor(privilegeItemProcessor())
                .writer(privilegeItemWriter())
                .build();
    }


    /**
     * Input of the pipeline. It fetches and reads the contents of countries_old.csv
     *
     * @return
     **/
    @Bean
    public FlatFileItemReader<Country> countriesReader() {
        FlatFileItemReader<Country> reader = new FlatFileItemReader<>();
        reader.setResource(new ClassPathResource("countries.csv"));
        reader.setLinesToSkip(1);
        reader.setLineMapper(
                new DefaultLineMapper<Country>() {
                    {
                        setLineTokenizer(new DelimitedLineTokenizer() {
                            {
                                setNames(new String[]{"countryName", "iso2", "iso3", "numeric", "currencyAlphabeticCode", "currencyCountryName", "currencyName", "phoneCode"});
                                setDelimiter(";");
                            }
                        });
                        setFieldSetMapper(new BeanWrapperFieldSetMapper<Country>() {
                            {
                                setTargetType(Country.class);
                            }
                        });
                    }
                }
        );
        return reader;
    }

    @Bean
    public CountryItemProcessor countryItemProcessor() {
        return new CountryItemProcessor();
    }

    /**
     * Output of the pipeline
     *
     * @return
     **/
    @Bean
    public CountryItemWriter countryItemWriter() {
        return new CountryItemWriter();
    }

    @Bean(name = "importCountriesJob")
    public Job importCountriesJob(CountriesJobCompletionNotificationListener notificationListener) {
        return jobBuilderFactory.get("importCountriesFactsJob")
                .incrementer(new RunIdIncrementer())
                .listener(notificationListener)
                .flow(countriesStep1())
                .end()
                .build();
    }

    @Bean
    public Step countriesStep1() {
        return stepBuilderFactory.get("countriesStep1")
                .<Country, Country>chunk(10)
                .reader(countriesReader())
                .processor(countryItemProcessor())
                .writer(countryItemWriter())
                .build();
    }
}
