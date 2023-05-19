import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription, from, of } from 'rxjs';
import { FileTypeResult, fileTypeFromBuffer } from 'file-type';
import { switchMap, take } from 'rxjs/operators';
import { Role } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';

type ValidFileExtension = 'png' | 'jpg' | 'jpeg';
type ValidMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

type BannerColors = {
  colorOne: string
  colorTwo: string
  colorThree: string
}

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent  implements OnInit, OnDestroy {
  form: FormGroup;

  validFileExtensions: ValidFileExtension[] = ['png', 'jpg', 'jpeg']
  validMimeTypes: ValidMimeType[] = ['image/png', 'image/jpg', 'image/jpeg']

  bannerColors: BannerColors = {
    colorOne: "#a0b4b7",
    colorTwo: "#dbe7e9",
    colorThree: "#bfd3d6"
  }

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  fullName$ = new BehaviorSubject<string>(null!);
  fullName = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.userFullName.pipe(take(1)).subscribe((fullName: string) => {
      this.fullName = fullName;
      this.fullName$.next(fullName);
    });

    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
      this.userFullImagePath = fullImagePath;
    });

    this.form = new FormGroup({
      file: new FormControl('null')
    });

    this.authService.userRole.pipe(take(1)).subscribe((role: Role) => {
      this.bannerColors = this.getBannerColors(role);
    })
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }

  private getBannerColors(role: Role): BannerColors {
    switch (role) {
      case 'admin':
        return {
          colorOne: '#daa520',
          colorTwo: '#f0e68c',
          colorThree: '#fafad2',
        };

      case 'premium':
        return {
          colorOne: '#bc8f8f',
          colorTwo: '#c09999',
          colorThree: '#ddadaf',
        };

      case 'user':
        return {
          colorOne: '#a0b4b7',
          colorTwo: '#dbe7e9',
          colorThree: '#bfd3d6',
        };

      default:
        return this.bannerColors;
    }
  }

  onFileSelect(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files![0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer())
      .pipe(
        switchMap((buffer: ArrayBuffer) => {
          return from(fileTypeFromBuffer(buffer)).pipe(
            switchMap((fileTypeResult: FileTypeResult | undefined) => {
              if (!fileTypeResult) {
                // TODO: error handling
                console.log({ error: 'file format not supported!' });
                return of();
              }
              const { ext, mime } = fileTypeResult;
              const isFileTypeLegit = this.validFileExtensions.includes(
                ext as any
              );
              const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
              const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
              if (!isFileLegit) {
                // TODO: error handling
                console.log({
                  error: 'file format does not match file extension!',
                });
                return of();
              }
              return this.authService.uploadUserImage(formData);
          })
        );
      })
    ).subscribe();

    this.form.reset();
  }

}
