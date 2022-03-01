//package com.swifttdial.atservice.utils.at;
//
//public final class VoiceService extends Service {
//    private VoiceService sInstance;
//    private IVoice voice;
//
//    private VoiceService(String username, String apiKey) {
//        super(username, apiKey);
//    }
//
//    VoiceService() {
//    }
//
//    protected VoiceService getInstance(String username, String apiKey) {
//        if (this.sInstance == null) {
//            this.sInstance = new VoiceService(username, apiKey);
//        }
//
//        return this.sInstance;
//    }
//
//    protected boolean isInitialized() {
//        return this.sInstance != null;
//    }
//
//    protected void initService() {
//        String baseUrl = "https://voice." + (isSandbox ? "sandbox.africastalking.com" : "africastalking.com") + "/";
//        this.voice = (IVoice)this.mRetrofitBuilder.baseUrl(baseUrl).build().create(IVoice.class);
//    }
//
//    protected void destroyService() {
//        if (this.sInstance != null) {
//            this.sInstance = null;
//        }
//
//    }
//
//    public CallResponse call(String to, String from) throws IOException {
//        this.checkPhoneNumber(to);
//        Call<CallResponse> call = this.voice.call(this.mUsername, to, from);
//        Response<CallResponse> resp = call.execute();
//        if (!resp.isSuccessful()) {
//            throw new IOException(resp.errorBody().string());
//        } else {
//            return (CallResponse)resp.body();
//        }
//    }
//
//    public CallResponse call(String to) throws IOException {
//        return this.call(to, "");
//    }
//
//    public void call(String to, String from, Callback<CallResponse> callback) {
//        try {
//            this.checkPhoneNumber(to);
//            Call<CallResponse> call = this.voice.call(this.mUsername, to, from);
//            call.enqueue(this.makeCallback(callback));
//        } catch (IOException var5) {
//            callback.onFailure(var5);
//        }
//
//    }
//
//    public void call(String to, Callback<CallResponse> callback) {
//        this.call(to, "", callback);
//    }
//
//    public CallTransferResponse callTransfer(String phoneNumber, String sessionId) throws IOException {
//        return this.callTransfer(phoneNumber, sessionId, "", "");
//    }
//
//    public void callTransfer(String phoneNumber, String sessionId, Callback<CallTransferResponse> callback) {
//        this.callTransfer(phoneNumber, sessionId, "", "", callback);
//    }
//
//    public CallTransferResponse callTransfer(String phoneNumber, String sessionId, String callLeg) throws IOException {
//        return this.callTransfer(phoneNumber, sessionId, callLeg, "");
//    }
//
//    public void callTransfer(String phoneNumber, String sessionId, String callLeg, Callback<CallTransferResponse> callback) {
//        this.callTransfer(phoneNumber, sessionId, callLeg, "", callback);
//    }
//
//    public CallTransferResponse callTransfer(String phoneNumber, String sessionId, String callLeg, String holdMusicUrl) throws IOException {
//        this.checkPhoneNumber(phoneNumber);
//        Call<CallTransferResponse> call = this.voice.callTransfer(this.mUsername, phoneNumber, sessionId, callLeg.isEmpty() ? null : callLeg, holdMusicUrl.isEmpty() ? null : holdMusicUrl);
//        Response<CallTransferResponse> resp = call.execute();
//        if (!resp.isSuccessful()) {
//            throw new IOException(resp.errorBody().string());
//        } else {
//            return (CallTransferResponse)resp.body();
//        }
//    }
//
//    public void callTransfer(String phoneNumber, String sessionId, String callLeg, String holdMusicUrl, Callback<CallTransferResponse> callback) {
//        try {
//            this.checkPhoneNumber(phoneNumber);
//            Call<CallTransferResponse> call = this.voice.callTransfer(this.mUsername, phoneNumber, sessionId, callLeg.isEmpty() ? null : callLeg, holdMusicUrl.isEmpty() ? null : holdMusicUrl);
//            call.enqueue(this.makeCallback(callback));
//        } catch (IOException var7) {
//            callback.onFailure(var7);
//        }
//
//    }
//
//    public QueuedCallsResponse fetchQueuedCalls(String phoneNumber) throws IOException {
//        Call<QueuedCallsResponse> call = this.voice.queueStatus(this.mUsername, phoneNumber);
//        Response<QueuedCallsResponse> resp = call.execute();
//        if (!resp.isSuccessful()) {
//            throw new IOException(resp.errorBody().string());
//        } else {
//            return (QueuedCallsResponse)resp.body();
//        }
//    }
//
//    public void fetchQueuedCalls(String phoneNumber, Callback<QueuedCallsResponse> callback) {
//        Call<QueuedCallsResponse> call = this.voice.queueStatus(this.mUsername, phoneNumber);
//        call.enqueue(this.makeCallback(callback));
//    }
//
//    public String uploadMediaFile(String phoneNumber, String url) throws IOException {
//        Call<String> call = this.voice.mediaUpload(this.mUsername, url, phoneNumber);
//        Response<String> resp = call.execute();
//        if (!resp.isSuccessful()) {
//            throw new IOException(resp.errorBody().string());
//        } else {
//            return (String)resp.body();
//        }
//    }
//
//    public void uploadMediaFile(String phoneNumber, String url, Callback<String> callback) {
//        Call<String> call = this.voice.mediaUpload(this.mUsername, url, phoneNumber);
//        call.enqueue(this.makeCallback(callback));
//    }
//}
