package com.sycomafrica.syhos.authorizationservice.configurations;

import com.sycomafrica.syhos.authorizationservice.dto.Role;
import com.sycomafrica.syhos.authorizationservice.dto.SystemUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.security.oauth2.provider.token.TokenEnhancerChain;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.security.oauth2.provider.token.store.KeyStoreKeyFactory;

import java.security.KeyPair;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableAuthorizationServer
class OAuth2Config extends AuthorizationServerConfigurerAdapter {

    @Value("${oauth.paths.token}")
    private String tokenPath;

    // Required for password grants
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private ServerProperties server;

    @Bean
    public JwtAccessTokenConverter jwtAccessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        KeyPair keyPair = new KeyStoreKeyFactory(new ClassPathResource("jwt.jks"), "mypass".toCharArray()).getKeyPair("mytest");
        converter.setKeyPair(keyPair);
        return converter;
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        String prefix = server.getServletPrefix();
        endpoints.prefix(prefix);

        TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
        tokenEnhancerChain.setTokenEnhancers(Arrays.asList(tokenEnhancer(), jwtAccessTokenConverter()));
        endpoints
                .tokenStore(tokenStore())
                .tokenEnhancer(tokenEnhancerChain)
                .authenticationManager(authenticationManager)
                .pathMapping("/oauth/token", tokenPath)
                //.pathMapping("/oauth/check_token", checkTokenPath)
        ;
    }

    @Bean
    public TokenEnhancer tokenEnhancer() {
        return new CustomTokenEnhancer();
    }

    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(jwtAccessTokenConverter());
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {

        /*
         * Authorization code : for apps running on a web server, do you want to allow...? page
         * Implicit : for browser-based SPA or mobile apps
         * Password : for logging in with a username and password
         * Client credentials : for application access e.g. Microservices
         * The scope to which the client is limited. If scope is undefined or empty (the default) the client is not
         * limited by scope.
         */
        clients.inMemory()
                .withClient("syhos-web-ui")
                .secret("bCc-_?Wv5g%v8Zk?uXm+VRR69v-FbKtKQqwy@SfuA3qnemJEfzFG3wA7d3v5C9X#UKJ3@Rda&aWeP8urR4D@f2BKNDE88t&tJmR7n#@HSG#tS5bp&9ECy_w^qERZfSFK@e?4SebC&#gnXQ&g#C-R=yF4YsSXLRJZLUyhRvPY%FmmyuH3wg?2U$d#6?txLe2LG4V!c8!CbGC9MQzUWfU5uwq^aZyXkA*_jJ+gK^uAu7v#B?RxckdJw=j!QW^_A2B*")
                .authorizedGrantTypes("password","refresh_token")
                .authorities("ROLE_CLIENT", "ROLE_TRUSTED_CLIENT")
                .scopes("create", "read", "update", "delete").autoApprove(true)
                .accessTokenValiditySeconds((int) TimeUnit.HOURS.toSeconds(4))
                .refreshTokenValiditySeconds((int) TimeUnit.HOURS.toSeconds(5))
                .additionalInformation("foo:bar", "spam:bucket", "crap", "bad:")
                .and()
                .withClient("syhos-global-admin-ui")
                .secret("$u>WWU0k.W!L[Tz[PMsJ+nV2V1u4{4oUB87iol8^O_j\\tzG@S~^@U,!F~zB3N,pFMx+YpC(3Wk+~Jl?lK.b@3\"u=uW'\\B@x%mbW1")
                .authorizedGrantTypes("client_credentials", "password")
                .authorities("CREATE_INSTITUTION", "CREATE_INSTITUTION_LICENSE", "READ_INSTITUTIONS", "UPDATE_INSTITUTION")
                .scopes("create", "read", "update", "delete").autoApprove(true)
                .accessTokenValiditySeconds((int) TimeUnit.MINUTES.toSeconds(5))
                .and()
                .withClient("syhos-mirth-connect-engine")
                .secret("$uWWU0k.W!L[Tz[PMsJ+nV2V1u4{4oUB87iol8^O_j!G@S~^@U,!F~zB3N,pFMx+YpC(3Wk+~Jl?lK.b@3\"u=uW'\\B@x%mbW1")
                .authorizedGrantTypes("client_credentials")
                .authorities("POST_INBOUND_REQUEST")
                .scopes("create").autoApprove(true)
                .accessTokenValiditySeconds((int) TimeUnit.DAYS.toSeconds(365));
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer oauthServer) {
        oauthServer.checkTokenAccess("hasRole('ROLE_TRUSTED_CLIENT')");
        oauthServer.tokenKeyAccess("permitAll()").checkTokenAccess("isAuthenticated()");
    }

}

class CustomTokenEnhancer implements TokenEnhancer {

    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        if(authentication.getPrincipal() instanceof SystemUser) {
            SystemUser systemUser = (SystemUser) authentication.getPrincipal();

            Map<String, Object> additionalInfo = new HashMap<>();
            additionalInfo.put("authorities", AuthorityUtils.authorityListToSet(systemUser.getAuthorities()));
            additionalInfo.put("publicId", systemUser.getPublicId());
            additionalInfo.put("fullName", systemUser.getFullName());
            additionalInfo.put("forcePasswordReset", systemUser.isForcePasswordReset());
            additionalInfo.put("roles", systemUser.getRoles());
            additionalInfo.put("institution", systemUser.getTenant());

            if(!systemUser.getRoles().isEmpty() && systemUser.getRoles().size() == 1) {
                Optional<Role> activeRole = systemUser.getRoles().stream().findFirst();

                activeRole.ifPresent(role -> additionalInfo.put("role", role.getPublicId()));

                if(activeRole.isPresent() && activeRole.get().getDepartment() != null) {
                    additionalInfo.put("department", activeRole.get().getDepartment().getPublicId());
                }
            }

            ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(additionalInfo);
        }
        return accessToken;
    }

}