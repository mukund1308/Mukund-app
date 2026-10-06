# Step-by-Step Google Play Console Upload Sequence
## Mukund QMS v0.15 – Android Release

**App Name:** Mukund Quality Management System  
**Version:** v0.15  
**Date:** [Insert Date]  
**Prepared By:** [Name]

---

## Prerequisites
- [ ] Google Play Developer Account created and verified
- [ ] Payment method added to Play Console
- [ ] Release AAB file ready at: _______________
- [ ] Version code verified: _______________
- [ ] Version name verified: _______________
- [ ] QA sign-off completed
- [ ] Store listing details prepared

---

## Step 1: Access Google Play Console

1. Open Google Play Console: https://play.google.com/console
2. Log in with your Google Developer Account
3. Click on your app name (or create new app if first time)
4. You are now in the app's main dashboard

---

## Step 2: Navigate to Create a Release

1. In the left sidebar, click **"Release" → "Production"** (or "Internal Testing" for first submission)
2. You will see the release management page
3. Click **"Create new release"** button
4. You are now in the release creation workflow

---

## Step 3: Upload App Bundle (AAB)

1. Click **"Browse files"** in the "App bundles" section
2. Navigate to your release AAB file location:
   - Path: `build/app/outputs/bundle/release/app-release.aab`
3. Select the AAB file and click **"Open"**
4. Wait for the file to upload (may take 1-2 minutes)
5. Verify upload success:
   - [ ] File size shows correctly
   - [ ] No upload errors appear
   - [ ] AAB is listed under "App bundles"

---

## Step 4: Verify App Signing

1. After upload, Play Console shows signing information
2. Verify the following:
   - [ ] Signing key is displayed
   - [ ] Signing certificate fingerprint is visible
   - [ ] App signing status shows "Signed by Google Play"
3. If signing is not configured:
   - Follow Play Console instructions to enable Play App Signing
   - Upload your keystore or let Google handle signing (recommended)

---

## Step 5: Add Release Notes

1. Scroll down to **"Release notes"** section
2. Click **"Add release notes for this release"**
3. Select language (default: English)
4. Enter release notes in the text field:
   ```
   Version 0.15 Release Notes
   - [Feature 1]
   - [Bug fix 1]
   - [Improvement 1]
   ```
5. Click **"Add language"** to add more languages if needed
6. Verify release notes are saved

---

## Step 6: Review Release Summary

1. Scroll to the top of the release page
2. Review the summary section:
   - [ ] App bundle uploaded successfully
   - [ ] Version code is correct
   - [ ] Version name is correct
   - [ ] Release notes are added
   - [ ] No validation errors shown
3. If errors appear, fix them before proceeding

---

## Step 7: Save and Review the Release

1. Scroll to the bottom of the page
2. Click **"Save"** to save the release as draft (optional)
   - Or proceed directly to next step
3. Click **"Review release"** to proceed to review screen
4. You are now on the release review page

---

## Step 8: Final Pre-Submission Review

On the release review page, verify:
- [ ] App bundle is uploaded
- [ ] Version code and name are correct
- [ ] Release notes are clear and complete
- [ ] No validation errors or warnings remain
- [ ] App signing is configured
- [ ] Target Android version is correct (minimum API level)

If any issues appear:
1. Click **"Back"** to return to release edit
2. Fix the issue
3. Click **"Review release"** again

---

## Step 9: Submit Release for Review

1. On the release review page, click **"Submit release"** button
2. A confirmation dialog appears
3. Verify the message:
   - "Submit release to production?"
   - Or "Submit release to internal testing?" (first time)
4. Click **"Submit"** to confirm
5. Wait for submission confirmation

---

## Step 10: Submission Confirmation

After clicking submit:
1. You will see a success message:
   - "Release submitted successfully"
2. The release status changes to "Pending review" or "Live" (depending on track)
3. A timestamp shows submission time
4. You are returned to the release management page

---

## Step 11: Monitor Review Status

### In Play Console:
1. Go to **"Release" → "Production"** (or your release track)
2. Look for your release in the list
3. Status will show:
   - "Pending review" → App is being reviewed by Google
   - "In review" → Review in progress
   - "Live" → App is approved and live

### Expected Timeline:
- Usually reviewed within 2-24 hours
- Can take up to 3 days in some cases
- You will receive email notification when review is complete

### Check Email:
1. Monitor your registered Google Play developer email
2. Google sends notifications for:
   - Review approved
   - Review rejected (with reasons)
   - App published/live

---

## Step 12: After Approval

### If App is Approved:
1. App automatically goes live to users
2. App becomes searchable on Play Store within a few hours
3. Download link becomes active
4. User reviews and ratings start appearing

### Post-Launch Tasks:
- [ ] Verify app is searchable on Play Store
- [ ] Test download and installation on real device
- [ ] Monitor crash reports in Play Console
- [ ] Monitor user reviews and ratings
- [ ] Have support team ready for user inquiries

### If App is Rejected:
1. Review rejection email for specific reasons
2. Common rejection reasons:
   - Policy violation
   - Malware/security issue
   - Misleading store listing
   - Prohibited content
3. Fix the issues
4. Resubmit following the same steps (Step 1-11)

---

## Step 13: Post-Launch Monitoring

### Daily Monitoring:
1. Go to **"Dashboards"** to view app statistics
2. Monitor:
   - [ ] Install count
   - [ ] Uninstall count
   - [ ] Active installs
   - [ ] Crash rate
   - [ ] ANR (Application Not Responding) rate

### Check for Issues:
1. Go to **"Analytics" → "Crashes & ANRs"**
2. Review crash reports
3. If crashes found:
   - Investigate root cause
   - Fix in code
   - Prepare hotfix release

### Monitor User Feedback:
1. Go to **"Ratings & reviews"**
2. Read user reviews
3. Respond to user feedback (especially critical reviews)
4. Note common issues for next update

---

## Quick Reference: Key Locations in Play Console

| Task | Location |
|---|---|
| Upload AAB | Release → Production → Create new release |
| View release status | Release → Production |
| Check crashes | Analytics → Crashes & ANRs |
| View ratings | Ratings & reviews |
| App statistics | Dashboards |
| Store listing | Store presence → Main store listing |
| Privacy policy | Store presence → Privacy policy |
| Contact info | Store presence → Contact details |

---

## Troubleshooting

### Upload Fails
- [ ] Check file size (AAB should be < 100 MB typically)
- [ ] Verify file is a valid AAB (not APK)
- [ ] Check internet connection
- [ ] Retry upload

### Validation Errors
- [ ] Read error message carefully
- [ ] Common issues:
  - Missing privacy policy URL
  - Missing app description
  - Invalid version code/name
  - App signing not configured
- [ ] Fix error and save release again

### Review Takes Too Long
- [ ] Wait 24-48 hours (normal processing time)
- [ ] Check spam/junk email for Google notifications
- [ ] Go to Play Console and check status manually
- [ ] Contact Google Play Support if > 72 hours

### App Rejected During Review
- [ ] Read rejection email carefully
- [ ] Note specific policy violation
- [ ] Fix issue in app or store listing
- [ ] Resubmit with explanation in release notes

---

## Final Submission Checklist

Before clicking "Submit release":
- [ ] AAB file uploaded successfully
- [ ] Version code and name verified
- [ ] Release notes added and clear
- [ ] Store listing complete (title, description, screenshots)
- [ ] Privacy policy URL added
- [ ] Contact information complete
- [ ] App signing configured
- [ ] No validation errors in Play Console
- [ ] QA final approval obtained
- [ ] Team is ready for launch

---

## Sign-Off

**Ready to Submit to Google Play:**
- [ ] Yes, proceed with upload
- [ ] No, not ready yet

**Submitted by:**
Name: ________________________  
Date: ________________________  
Time: ________________________  

**Submission Status:**
- [ ] Pending review
- [ ] Approved
- [ ] Rejected

**Store URL (after approval):**
_____________________________________________________________________

**Notes:**
_____________________________________________________________________
_____________________________________________________________________

---

**This guide confirms step-by-step upload sequence for Mukund QMS v0.15 to Google Play Store.**
