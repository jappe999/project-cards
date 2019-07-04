type ModalOptions = { confirmed: boolean; open: boolean }

export class Modal {
  confirmed: boolean
  isOpen: boolean

  constructor(
    { confirmed, open }: ModalOptions = {
      confirmed: false,
      open: false,
    },
  ) {
    this.confirmed = confirmed
    this.isOpen = open
  }

  open(): void {
    setTimeout(() => {
      this.isOpen = true
    }, 100)
  }

  toggle(): void {
    setTimeout(() => {
      this.isOpen = !this.isOpen
    }, 100)
  }

  close(): void {
    this.isOpen = false
  }

  confirm(): void {
    this.confirmed = true
    this.close()
  }

  deny(): void {
    this.confirmed = false
    this.close()
  }
}
