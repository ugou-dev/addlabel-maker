/*
  # Fix Function Search Path Security

  ## Changes
  1. Security Enhancements
     - Set immutable search_path for check_contact_rate_limit function
     - Set immutable search_path for validate_contact_submission function
     - This prevents search_path injection attacks
  
  ## Important Notes
  - Functions are recreated with SET search_path = public
  - This ensures the functions always use the public schema
  - Prevents potential SQL injection through search_path manipulation
*/

-- Recreate rate limiting function with fixed search_path
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
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;

-- Recreate validation function with fixed search_path
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
$$ LANGUAGE plpgsql
SET search_path = public;
