import { IsUUID, IsString, IsOptional, IsUrl, IsInt, MinLength, MaxLength, Min } from 'class-validator';

export class SubmitApplicationDto {
  @IsUUID()
  jobId: string;

  @IsString()
  @MinLength(50, { message: 'Cover letter must be at least 50 characters' })
  @MaxLength(5000, { message: 'Cover letter must not exceed 5000 characters' })
  coverLetter: string;

  @IsUrl()
  @IsOptional()
  resumeUrl?: string;

  @IsUrl()
  @IsOptional()
  portfolioUrl?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  expectedSalary?: number;
}