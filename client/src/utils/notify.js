import toastr from 'toastr';
import error from '../../sounds/error.mp3';

export default (toastType, toastMessage) => {
  toastr.remove();
  toastr[toastType](toastMessage);

  if (toastType === 'error') {
    const audio = new Audio(`${error}`);
    audio.play();
  }
};
