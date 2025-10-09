// helper/greeting.js
export const getGreetingMessage = (
  clockedIn,
  userName,
  currentTime = new Date()
) => {
  const hour = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  // Innan in-stämpling
  if (!clockedIn) {
    if (hour >= 6 && hour < 9) {
      return `God morgon ${userName}!`;
    } else if (
      (hour === 10 && minutes >= 30) ||
      (hour > 10 && hour < 13) ||
      (hour === 13 && minutes <= 30)
    ) {
      return `Bra jobbat idag ${userName}! Njut av din lunch.`;
    } else if ((hour === 14 && minutes >= 20) || hour >= 15) {
      return `Bra jobbat idag ${userName}! Gå hem och vila, vi ses.`;
    } else {
      return `Vänligen stämpla in.`;
    }
  }

  // Efter in-stämpling (om du vill samma logik)
  if (clockedIn) {
    if (hour >= 15) {
      return `Bra jobbat idag ${userName}! Gå hem och vila, vi ses.`;
    } else {
      return `Bra jobbat! Fortsätt det goda arbetet idag.`;
    }
  }
};
