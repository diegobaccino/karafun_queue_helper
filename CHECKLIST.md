# Go-Live Checklist

Use this checklist before running KaraFun Queue Display at an event or venue.

## Environment

- [ ] Target machine is Windows 10/11
- [ ] Internet connection is stable
- [ ] Display orientation is portrait (or intended orientation)
- [ ] Power/sleep settings prevent standby during event hours

## Application Readiness

- [ ] Dependencies installed (`npm install`) on build machine
- [ ] App launches (`npm start`) without startup errors
- [ ] Portable EXE built if deploying without Node.js
- [ ] Correct EXE copied to target machine

## Session Connection

- [ ] Session modal opens as expected
- [ ] Session ID or URL is accepted
- [ ] Nickname is accepted
- [ ] Status reaches connected/session-joined/live-queue state

## Display Validation

- [ ] Current song card renders correctly
- [ ] Queue list updates when songs are added/removed
- [ ] Cover art loads where metadata is available
- [ ] QR code opens the same active session on a phone
- [ ] Right-click toggles fullscreen correctly

## Reliability Checks

- [ ] App remains connected for at least 10 minutes
- [ ] Reconnect path works via Change Session
- [ ] App recovers after restart

## Deployment Hardening

- [ ] Startup shortcut configured (`shell:startup`) if required
- [ ] Kiosk user account is configured
- [ ] Unnecessary desktop apps/notifications are disabled

## Event-Day Fallback Plan

- [ ] Keyboard/mouse accessible for quick recovery
- [ ] Operator knows reconnect steps
- [ ] Latest known-good EXE is backed up locally

## Quick Recovery Steps

1. Use Change Session.
2. Re-enter session ID/URL.
3. Check internet connectivity.
4. Restart app if queue still does not update.
