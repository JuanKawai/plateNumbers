import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public plateNumbers = [];
  public highlightedPlateNumbers = [];
  public postfix = '';
  public numbers = '';
  public prefix = 'CJ';
  private postfixes = [];
  private preferredNumbers = [];
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

  public getPlates() {
    this.plateNumbers = [];
    this.highlightedPlateNumbers = [];
    this.separateLetters();
    this.separateNumbers();
    this.postfixes.forEach(postfix => {
      for (let i = 1; i < 100; ++i) {
        let plateNumber = this.prefix.toUpperCase();
        if (i < 10) {
          plateNumber += '0' + i + postfix;
        } else {
          plateNumber += i + postfix;
        }
        const request = {
          'plateNumber': plateNumber,
          'userEmail': 'asd@asd.com',
          'language': 'RO'
        };
        this.makeRequest(request).subscribe((resp) => {
          if (!resp.message.includes('nu')) {
            if (this.preferredNumbers.includes(i.toString())) {
              this.highlightedPlateNumbers.push(plateNumber);
            } else {
              this.plateNumbers.push(plateNumber);
            }
          }
        });
      }
    });
  }

  private separateLetters() {
    this.postfix = this.postfix.replace(/\s/g, '').toUpperCase();
    this.postfixes = this.postfix.split(',');
  }

  private separateNumbers() {
    this.preferredNumbers = this.numbers.replace(/\s/g, '').split(',');
  }

  private makeRequest(request): Observable<any> {
    return this.http.post<string>('https://www.drpciv.ro/portal-services/plate-status', request, this.httpOptions);
  }
}
