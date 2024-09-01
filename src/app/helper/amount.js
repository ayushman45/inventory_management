export const convertAmount = (amount) => {
    if(amount >= 100000){
        return `${amount/100000}L`;
    }
    else if(amount >= 1000){
        return `${amount/1000}K`;
    }
    else{
        return amount;
    }
  }

export const convertAmountAddCommas = (amount) => {
    let res = "";
    let flag = 0;
    let temp = amount.toString().split("");
    for (let i = temp.length - 1; i>=0; i--) {
        res=temp[i]+res;
        flag++;
        if(flag===3){
            res=","+res;
        }
        else{
            if(flag>3 && (flag-3)%2==0 && i!=0){
                res=","+res;
            }
        }
    
    }
    return res;
    
}