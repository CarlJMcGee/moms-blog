export const toSeconds = function (
  minutes = 0,
  hours = 0,
  days = 0,
  weeks = 0
): number {
  const week = weeks * 7 * 24 * 60 * 60;
  const day = days * 24 * 60 * 60;
  const hour = hours * 60 * 60;
  const minute = minutes * 60;
  return week + day + hour + minute;
};

export const timeOut = (funct: () => any, delay: number): Promise<any> => {
 return new Promise((resolve, reject) => {
    setTimeout(funct, delay)
    resolve()
  })
}

const main = async function (){
  const func = ()=> {
    console.log(`Times up!`);
  }
console.log(`start`)
 await timeOut(() => {
   console.log(`middle`);
 }, 3000)
  console.log(`end`);
}
main()