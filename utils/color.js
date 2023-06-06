

export const generateRandomColor = () => {
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
}

export const generateColorProggress = (averageApprove, current_progreess) => {
     if(current_progreess >= averageApprove){
        return "#015705";
     }else if(current_progreess < averageApprove && (current_progreess > (averageApprove / 2))){
        return "#dbf20a";
     }else{
        return "#c40824";
     }
}