import moment from "moment"


export const sortChats = (items = []) => {
    if (!items) {
        return [];
    }
    const customItems = [...items];
    const newList = customItems?.sort((itemA, itemB) => {
        return moment(itemA?.lastMessage?.created_at).isBefore(moment(itemB?.lastMessage?.created_at)) ? 1 : -1;
    })
    return newList;
}

export const MessageIsRead = (message, uid) => {
    if (message?.user_from_id === uid) {
        return true;
    }
    return message?.isRead === "1";
}