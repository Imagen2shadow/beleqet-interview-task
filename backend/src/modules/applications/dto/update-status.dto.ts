import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  SCREENING = 'SCREENING',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  HIRED = 'HIRED',
}

export class UpdateStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}