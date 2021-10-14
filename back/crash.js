function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
  
export function generateCrash() {
    let maxN = Math.pow(2,52);
    let t = getRandomInt(maxN);
    let multiplier = (((maxN*100)-t)/(maxN-t))/100;
    return multiplier;
}