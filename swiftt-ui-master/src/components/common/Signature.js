import React, { Component } from 'react';
import SockJsClient from 'react-stomp';
import topics from '../../utils/Constants';

const { SIGNATURE, MESSAGE } = topics;
const { INITIALIZE_READER, STOP_CAPTURE, CAPTURE } = SIGNATURE;

class Signature extends Component {
    /**
     * Callback after a successful connection.
     */
    onConnected = () => {
      console.log('Connected');
      this.initPrintReader();
    }

      /**
       * Callback after a disconnection.
       */
      onDisconnected = () => {
        console.log('Connected');
      }


    /**
     * Callback for messages from the server.
     * @param msg the response message from the server.
     * @param topic the subscribed topic
     */
    onMessage = (msg, topic) => {
      if (topic === CAPTURE) {
        console.log(`Capture: ${msg.rawTemplate}`);
      } else if (topic === INITIALIZE_READER) {
        console.log(`Signature reader: ${msg.message}`);
      } else if (topic === STOP_CAPTURE) {
        console.log(`Stop capture: ${msg.message}`);
      } else if (topic === topics.MESSAGE) {
        console.log(`Message: ${msg.message}`);
      }
    }

    /**
     * Sends the message to the server over the socket client created on render.
     */
    sendMessage = (topic, msg) => {
      this.clientRef.sendMessage(topic, msg);
    }

    /**
     * Sends a message to initialize the signature reader.
     * @returns The type of the signature reader connected.
     *
     * Sends the command to capture the signature.
     * @returns The captured signature. It is automatically returned to the client when on
     * clicks okay on the device.
     */
    initSignaturePad = () => {
      const payload = {
        who: 'who',
        why: 'why',
      };
      this.sendMessage('/app/signature/initialize', JSON.stringify({ who: 'Daniel', why: 'Sign invoice' }));
    }

    render() {
      return (
        <div>
          <SockJsClient
            url="https://localhost:8089/ipera-local-server"
            topics={[
                        MESSAGE,
                        INITIALIZE_READER,
                        CAPTURE,
                        STOP_CAPTURE,
                    ]}
            onMessage={this.onMessage}
            onConnected={this.onConnected}
            onDisconnected={this.onDisconnected}
            debug
            ref={(client) => { this.clientRef = client; }}
          />
          <p>
            <button onClick={this.initSignaturePad}>Init signature reader.</button>
          </p>
          <p>
            <button onClick={this.captureSignature}>Capture signature</button>
          </p>
        </div>
      );
    }
}

export default Signature;
