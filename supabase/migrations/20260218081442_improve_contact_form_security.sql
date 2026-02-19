/*
  # Improve Contact Form Security

  ## Changes
  1. Security Enhancements
     - Add rate limiting function to prevent spam (max 3 submissions per IP per hour)
     - Add validation function for email format and required fields
     - Update RLS policy with proper validation checks
  
  2. Modified Policies
     - Replace unsafe "Anyone can submit contact form" policy with validated submission policy
     - Add proper constraints to prevent abuse
  
  ## Important Notes
  - Rate limiting is based on IP address and timestamp
  - Email validation uses PostgreSQL regex pattern
  - Required fields: name, email, subject, message must not be empty
  - Maximum 3 submissions per IP address per hour
*/

-- Drop existing unsafe policy
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Create rate limiting function
CREATE OR REPLACE FUNCTION check_contact_rate_limit(ip TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if IP has submitted more than 3 times in the last hour
  RETURN (
    SELECT COUNT(*) 
    FROM contact_submissions 
    WHERE ip_address = ip 
    AND created_at > NOW() - INTERVAL '1 hour'
  ) < 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create validation function
CREATE OR REPLACE FUNCTION validate_contact_submission(
  p_name TEXT,
  p_email TEXT,
  p_subject TEXT,
  p_message TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check all required fields are not empty
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RETURN FALSE;
  END IF;
  
  IF p_email IS NULL OR LENGTH(TRIM(p_email)) = 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Basic email format validation
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN FALSE;
  END IF;
  
  IF p_subject IS NULL OR LENGTH(TRIM(p_subject)) = 0 THEN
    RETURN FALSE;
  END IF;
  
  IF p_message IS NULL OR LENGTH(TRIM(p_message)) = 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Check length constraints
  IF LENGTH(p_name) > 100 OR LENGTH(p_email) > 200 OR 
     LENGTH(p_subject) > 200 OR LENGTH(p_message) > 2000 THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create new secure policy with validation and rate limiting
CREATE POLICY "Validated contact form submissions with rate limit"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Validate all fields
    validate_contact_submission(name, email, subject, message)
    -- Check rate limit (if ip_address is provided)
    AND (ip_address IS NULL OR check_contact_rate_limit(ip_address))
  );

-- Add index for better rate limit query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_ip_created 
  ON contact_submissions(ip_address, created_at DESC);
