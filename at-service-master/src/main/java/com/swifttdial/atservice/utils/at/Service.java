//package com.swifttdial.atservice.utils.at;
//
//import java.io.IOException;
//import okhttp3.HttpUrl;
//import okhttp3.Request;
//import okhttp3.logging.HttpLoggingInterceptor;
//import okhttp3.logging.HttpLoggingInterceptor.Level;
//import retrofit2.Call;
//import retrofit2.Callback;
//import retrofit2.Response;
//import retrofit2.Retrofit.Builder;
//import retrofit2.converter.gson.GsonConverterFactory;
//import retrofit2.converter.scalars.ScalarsConverterFactory;
//
//abstract class Service {
//    Builder mRetrofitBuilder;
//    String mUsername;
//    protected String mIndempotencyKey = null;
//    static boolean isSandbox = false;
//    static Logger LOGGER = null;
//
//    Service(String username, String apiKey) {
//        this.mUsername = username;
//        okhttp3.OkHttpClient.Builder httpClient = new okhttp3.OkHttpClient.Builder();
//        httpClient.addInterceptor((chain) -> {
//            Request original = chain.request();
//            HttpUrl url = original.url();
//            if (AfricasTalking.hostOverride != null) {
//                url = url.newBuilder().host(AfricasTalking.hostOverride).build();
//            }
//
//            okhttp3.Request.Builder builder = original.newBuilder().url(url).addHeader("apiKey", apiKey).addHeader("Accept", "application/json");
//            if (this.mIndempotencyKey != null) {
//                builder.addHeader("Idempotency-Key", this.mIndempotencyKey);
//                this.mIndempotencyKey = null;
//            }
//
//            return chain.proceed(builder.build());
//        });
//        if (LOGGER != null) {
//            HttpLoggingInterceptor logger = new HttpLoggingInterceptor(new okhttp3.logging.HttpLoggingInterceptor.Logger() {
//                public void log(String message) {
//                    Service.LOGGER.log(message, new Object[0]);
//                }
//            });
//            logger.setLevel(Level.BODY);
//            httpClient.addInterceptor(logger);
//        }
//
//        this.mRetrofitBuilder = (new Builder()).addConverterFactory(ScalarsConverterFactory.create()).addConverterFactory(GsonConverterFactory.create()).client(httpClient.build());
//        this.initService();
//    }
//
//    Service() {
//    }
//
//    protected <T> Callback<T> makeCallback(final com.africastalking.Callback<T> cb) {
//        return new Callback<T>() {
//            public void onResponse(Call<T> call, Response<T> response) {
//                if (response.isSuccessful()) {
//                    cb.onSuccess(response.body());
//                } else {
//                    cb.onFailure(new Exception(response.message()));
//                }
//
//            }
//
//            public void onFailure(Call<T> call, Throwable t) {
//                cb.onFailure(t);
//            }
//        };
//    }
//
//    protected abstract <T extends Service> T getInstance(String var1, String var2);
//
//    protected abstract boolean isInitialized();
//
//    protected abstract void initService();
//
//    protected abstract void destroyService();
//
//    protected boolean checkPhoneNumber(String phone) throws IOException {
//        if (!phone.matches("^\\+\\d{1,3}\\d{3,}$")) {
//            throw new IOException("Invalid phone number: " + phone + "; Expecting number in format +XXXxxxxxxxxx");
//        } else {
//            return true;
//        }
//    }
//}