import React, { Component } from 'react';
import { Alert, Button, Tag, Divider, Badge } from 'antd';
import SockJsClient from 'react-stomp';
import topics from '../../utils/Constants';


const { FINGERPRINT, MESSAGE } = topics;
const { CAPTURE, INITIALIZE_READER, VERIFY, IMAGE } = FINGERPRINT;

/**
 * Handles finger print capturing. The images are returned as Base64. The
 */
class Fingerprint extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      isCaptureDeviceReady: false,
      showCapturedPrintView: false,
      activateCapture: false,
      message: null,
      fingerprintReader: null,
    });
  }
    /**
     * Sends the message to the server over the socket client created on render.
     */
    sendMessage = (topic, msg) => {
      this.clientRef.sendMessage(topic, msg);
    }

    /**
     * Sends a message to initialize the fingerprint reader.
     * @returns The type of the fingerprint reader connected.
     */
    initPrintReader = () => {
      this.sendMessage('/app/fingerprint', '');
    }

    /**
     * Sends the command to capture the finger print.
     * @returns The captured fingerprint as a Base64 image or instructions on the number of prints to be captured
     * to complete the process. The instructions are returned on @{/topic/message} as general messages.
     */
    capturePrint = () => {
      this.sendMessage('/app/fingerprint/capture', '');
      this.props.onChange({
        isCaptureDeviceReady: true,
        showCapturedPrintView: true,
        activateCapture: true,
      });
    }

    /**
     * Sends verification print.
     * @param print the fingerprint to verify against.
     * @returns the verification status message.
     */
    verifyPrint = (print) => {
      this.sendMessage('/app/fingerprint/verify', print);
    }

    /**
     * Callback for messages from the server.
     * @param msg the response message from the server.
     * @param topic the subscribed topic
     */
    onMessage = (msg, topic) => {
      let payload = {};
      if (topic === CAPTURE) {
        payload = {
          isCaptureDeviceReady: true,
          showCapturedPrintView: true,
          message: null,
        };
      } else if (topic === INITIALIZE_READER) {
        payload = {
          isCaptureDeviceReady: msg.active ? msg.active : false,
          fingerprintReader: msg.type ? msg.type : false,
          message: {
            type: 'success',
            description: 'Device is READY, click capture and select the hand and finger you want to capture fingerprints',
          },
        };
      } else if (topic === VERIFY) {
        payload = {
          isCaptureDeviceReady: true,
          message: {
            type: 'info',
            description: `Verify print:  ${msg.message}`,
          },
        };
      } else if (topic === IMAGE) {
        payload = {
          isCaptureDeviceReady: true,
          fingerPrint: msg.data,
          showCapturedPrintView: true,
          fingerprintReader: this.state.fingerprintReader,
        };
      } else if (topic === topics.MESSAGE) {
        payload = {
          message: {
            type: 'info',
            description: `${msg.message}`,
          },
        };
      }
      this.props.onChange({ ...payload });
      console.log('topic', topic);
      console.log('msg', msg);
      this.setState((prevState, props) => ({ ...payload }));
    }

    /**
     * Callback after a successful connection.
     */
    onConnected = () => {
      console.log('Connected');
      this.setState({ isCaptureDeviceReady: true });
    }

    /**
     * Callback after a disconnection.
     */
    onDisconnected = () => {
      this.setState({ isCaptureDeviceReady: false });
    }

    render() {
      const { isCaptureDeviceReady, showCapturedPrintView, message, fingerprintReader } = this.state;
      const AlertOfflineMessage = (
        <div>
          <p>
            Biometries capture device is offline. Please check connection.
          </p>
          {!isCaptureDeviceReady && (
            <Button type="primary" onClick={this.initPrintReader} ghost>Search Connected Devices</Button>
          )}
        </div>
      );

      return (
        <div>
          {!isCaptureDeviceReady ? (
            <Alert
              message="Device Status: Offline"
              description={AlertOfflineMessage}
              type="error"
              showIcon
            />
            ) : (
              <div>
                {message && message.description && message.type && (
                  <Alert
                    message={message.description}
                    type={message.type}
                    showIcon
                  />
                )}
                <Divider>
                 READER: <Badge dot status={fingerprintReader ? 'success' : 'warning'}>{fingerprintReader || 'NONE' }</Badge>
                </Divider>

                <Button type="primary" onClick={this.capturePrint} ghost>Capture</Button>
              </div>
              )}


          <SockJsClient
            url="https://localhost:8089/ipera-local-server"
            topics={[
                        MESSAGE,
                        INITIALIZE_READER,
                        CAPTURE,
                        VERIFY,
                        IMAGE,
                    ]}
            onMessage={this.onMessage}
            onConnected={this.onConnected}
            onDisconnected={this.onDisconnected}
            debug
            ref={(client) => { this.clientRef = client; }}
          />
        </div>
      );
    }
}

export default Fingerprint;
