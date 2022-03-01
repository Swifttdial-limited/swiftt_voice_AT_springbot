const topics = {
  MESSAGE: '/topic/message',
  FINGERPRINT: {
    CAPTURE: '/topic/fingerprint/capture',
    INITIALIZE_READER: '/topic/fingerprint/readers',
    VERIFY: '/topic/fingerprint/verify',
    IMAGE: '/topic/fingerprint/image',
  },
  SIGNATURE: {
    INITIALIZE_READER: '/topic/signature/readers',
    STOP_CAPTURE: '/topic/signature/stop',
  },
};
export default topics;
