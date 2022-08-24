import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiseService } from 'src/app/services/auth-servise.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TokenService } from 'src/app/services/token.service';
@Component({
  selector: 'app-register',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form!: FormGroup;
    
  
  

  constructor(private fb:FormBuilder,private authService:AuthServiseService , private userServ:EmployeeService,private tokenServ: TokenService ,private router: Router) { }
    
  infoForm() {
    this.form = this.fb.group({
      
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  getUsers(){
    this.userServ.getAll().subscribe( 
        response => { this.userServ.list = response["hydra:member"];
      }
      );
  }
  getUser(){
    var user:any;
    for(user in this.userServ.list){
        if(this.userServ.list[user].email==this.form.value.username){
          return this.userServ.list[user].roles[0];
        }
        
    }
    return 0;
  }
  onSubmit(){
    var role=this.getUser();
    var url:string;
    if(role=='ROLE_ADMIN'){
        url='/admin';
    }else{
        url='/client';
    }
    if(this.form.valid){
      this.authService.login(this.form.value).subscribe(
        result => {
          console.log(result);
          this.tokenServ.saveToken(result.token,url)
        },
        err => {
            console.log(err);
            alert("l'un de l'email ou mot de passe est incorrect !!! ")
        }
        
      );
      

    }
  }

  ngOnInit(): void {
    this.infoForm();
    this.getUsers();    
    
  }

}