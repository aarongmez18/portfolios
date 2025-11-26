import { Component, EventEmitter, Output } from '@angular/core';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  name = '';
  email = '';
  subject = '';
  message = '';
  emailError = '';

  showEmail = false;
  showSubject = false;
  showMessage = false;

  loading = false;
  progress = 0;

  @Output() submitted = new EventEmitter<{name: string, email: string, subject: string, message: string}>();

  onEnterName() {
    if (this.name.trim()) this.showEmail = true;
  }

onEnterEmail() {
  if (!this.email.trim()) {
    this.emailError = 'El correo es obligatorio';
    this.showSubject = false;
    return;
  }

  if (!this.validateEmail(this.email)) {
    this.emailError = 'Escribe una dirección de correo electrónico válida';
    this.showSubject = false;
    return;
  }

  this.emailError = '';
  this.showSubject = true;
}

  onEnterSubject() {
    if (this.subject.trim()) this.showMessage = true;
  }

  startLoadingAndSend() {
    if (!this.name || !this.email || !this.subject || !this.message || !this.validateEmail(this.email)) return;

    this.loading = true;
    this.progress = 0;
    const interval = setInterval(() => {
      this.progress += 2.5;
      if (this.progress >= 100) {
        clearInterval(interval);
        this.progress = 100;
        this.loading = false;

        this.submitted.emit({
          name: this.name,
          email: this.email,
          subject: this.subject,
          message: this.message
        });

        // Reset
        this.name = '';
        this.email = '';
        this.subject = '';
        this.message = '';
        this.showEmail = false;
        this.showSubject = false;
        this.showMessage = false;
      }
    }, 100); 
  }

  validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
