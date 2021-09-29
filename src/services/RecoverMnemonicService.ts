export class RecoverMnemonicService {
  public onShowInMenu: (show: boolean) => void = () => {};
  public onShowPage: (show: boolean) => void = () => {};

  public showInMenu() {
    this.onShowInMenu(true);
  }

  public dontShowInMenu() {
    this.onShowInMenu(false);
  }

  public showRecoverPage() {
    this.onShowPage(true);
  }
}
