import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

declare const $ : any;

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.sass']
})

export class TwoFactorAuthenticationComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  error : any;
  code_token : string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      OTP: ['',[Validators.required]],
    });

    this.code_token = this.authService.getCodeToken()
    if (this.code_token == null){
      this.router.navigate([''])
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    //    [Focus input] * /
    $('.input100').each(function() {
      $(this).on('blur', function() {
        if (
          $(this)
            .val()
            .trim() != ''
        ) {
          $(this).addClass('has-val');
        } else {
          $(this).removeClass('has-val');
        }
      });
    });
  }
  get f() {
    return this.loginForm.controls;
  }

  resendCode(){
    this.authService.resendCode().subscribe(data => {
      this.authService.setCodeToken(data['token'])
    });
    this.code_token = this.authService.getCodeToken();
  }

  login(OTP) {
    console.log(OTP, this.code_token);
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      this.authService.login(this.code_token, OTP).subscribe(
        success => this.router.navigate(['/dashboard/main']),
        error => {
          this.error = error.status;
        }
      );
    }
  }
}
