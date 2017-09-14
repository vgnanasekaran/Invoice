'use strict';

export function convertToLowestDenomination(amount) {
     console.log ('convertToLowestDenomination - amount before conversion - ', amount);
     const convAmount =  amount * 100 //conversion to cents
     console.log ('convertToLowestDenomination - amount before conversion - ', convAmount);
     return convAmount;
}
