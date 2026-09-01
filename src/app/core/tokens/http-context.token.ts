import { HttpContextToken } from '@angular/common/http';

// Token untuk menandai API bersifat Public (default: false / Protected)
export const IS_PUBLIC_API = new HttpContextToken<boolean>(() => false);
