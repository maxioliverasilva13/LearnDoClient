import Pusher from "pusher-js";

export let pusher = new Pusher("73c7a4829d7d8e48d310", {
  cluster: "us2",
});

export const PUSHER_MESSAGESENT_EVENT_NAME = "createMessage";

export const initPusher = () => {
  pusher = new Pusher("73c7a4829d7d8e48d310", {
    cluster: "us2",
  });
};

export const formatChannelMessageSendName = (userFormId, userToId) => {
    return `MessageFrom-${userFormId}-To-${userToId}`
}

export const subscribe = (channelName) => {
    const channel = pusher.subscribe(channelName);
    return channel;
}