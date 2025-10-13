import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../component/navbar/navbar.component";
import { HeaderComponent } from "../component/header/header.component";
import { filter, map } from "rxjs/operators";

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, HeaderComponent, RouterOutlet ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit{
  pageTitle: string = "";
  pageSubTitle: string = "";
  returnLink: string = "";
  
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let child = this.route.firstChild;
          while (child?.firstChild) {
            child = child.firstChild;
          }
          return child;
        })
      )
      .subscribe(route => {
        if(route?.snapshot.data) {
          this.pageTitle = route.snapshot.data['title'] || '';
          this.pageSubTitle = route.snapshot.data['subtitle'] || '';
          this.returnLink = route.snapshot.data['returnLink'] || '';
          console.log(this.pageTitle, this.pageSubTitle, this.returnLink);
        }
      });
  }

}
