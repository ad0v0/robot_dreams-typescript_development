const catName: string = 'Denis';
const catDateOfBirth: Date | string = new Date(2021, 8, 9);
const parentPhoneNumber: string | number = '+380666666666';
const wasFedToday: boolean | undefined = undefined;

const displayCatData = (
  catName: string,
  catDateOfBirth: Date | string,
  parentPhoneNumber: string | number,
  wasFedToday?: boolean
): string => {
  let message: string = '';

  if (wasFedToday === true) {
    message = `I was fed? Who told you this bullshit? Feed me!`;
  } else if (wasFedToday === false) {
    message = `How could you not feed me yet?! Shame and I'm finding a new pet parent! Feed me!`;
  } else {
    message = `... Well, you know the deal. Feed me!`;
  }

  return `
    Cat passport: 
    - Name: ${catName}
    - Date of birth: ${catDateOfBirth}
    - Parent phone number: ${parentPhoneNumber}
    - Status: ${message}
  `;
};

console.log(displayCatData(catName, catDateOfBirth, parentPhoneNumber, wasFedToday));