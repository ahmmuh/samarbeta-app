// // helper/greeting.js
// export const getGreetingMessage = (
//   clockedIn,
//   userName,
//   currentTime = new Date()
// ) => {
//   const hour = currentTime.getHours();
//   const minutes = currentTime.getMinutes();

//   // Innan in-stämpling
//   if (!clockedIn) {
//     if (hour >= 6 && hour < 9) {
//       return `God morgon ${userName}!`;
//     } else if (
//       (hour === 10 && minutes >= 30) ||
//       (hour > 10 && hour < 13) ||
//       (hour === 13 && minutes <= 30)
//     ) {
//       return `Bra jobbat idag ${userName}! Njut av din lunch.`;
//     } else if ((hour === 14 && minutes >= 20) || hour >= 15) {
//       return `Bra jobbat idag ${userName}! Gå hem och vila, vi ses.`;
//     } else {
//       return `Vänligen stämpla in /ut`;
//     }
//   }

//   // Efter in-stämpling (om du vill samma logik)
//   if (clockedIn) {
//     if (hour >= 15) {
//       return `Bra jobbat idag ${userName}! Gå hem och vila, vi ses.`;
//     } else {
//       return `Bra jobbat! Fortsätt det goda arbetet idag.`;
//     }
//   }
// };
//Ny kod

export const getGreetingMessage = (
  clockedIn,
  userName,
  currentTime = new Date()
) => {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  if (clockedIn) {
    // In-stämpling: tidigast 05:50, senast 06:05
    if (totalMinutes < 5 * 60 + 50) {
      return `Du stämplade in för tidigt, ${userName}.`;
    } else if (totalMinutes > 6 * 60 + 5) {
      return `Du stämplade in för sent, ${userName}. Försök komma tidigare nästa gång.`;
    } else {
      return `God morgon, ${userName}! Ha en bra dag på jobbet.`;
    }
  } else {
    // Ut-stämpling
    if (hours < 14 || (hours === 14 && minutes < 30)) {
      return `Ha en bra dag, ${userName}!`;
    } else if (
      (hours === 14 && minutes >= 30) ||
      (hours === 15 && minutes < 30)
    ) {
      return `Dags att koppla av, ${userName}! Bra jobbat idag, vi ses imorgon.`;
    } else {
      return `Du stämplade ut sent idag, ${userName}. Försök komma tidigare nästa gång.`;
    }
  }
};
