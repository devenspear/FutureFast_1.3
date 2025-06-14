"use client";

import React, { useEffect } from "react";

/**
 * MailerLite embedded signup form wrapper.
 *
 * We keep the original MailerLite HTML snippet intact via `dangerouslySetInnerHTML` so that
 * their own scripts/style run as-is. In addition we dynamically load the MailerLite universal
 * script to initialise the account.  Styling wrappers match the previous FutureFast form
 * container so the look & feel is preserved.
 */

export default function MailerLiteEmbed() {
  // Load the MailerLite universal script once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const win = window as typeof window & { ml?: (event: string, account: string) => void };
    if (win.ml) return; // already loaded
    const script = document.createElement("script");
    script.src = "https://assets.mailerlite.com/js/universal.js";
    script.async = true;
    script.onload = () => {
      // MailerLite exposes global `ml`, typings not available
      const winMl = (window as typeof window & { ml?: (event: string, account: string) => void }).ml;
      if (winMl) {
        winMl("account", "1595754");
      }
    };
    document.body.appendChild(script);
  }, []);

  // Raw HTML snippet from MailerLite (truncated comments removed for brevity)
  const embedHtml = `
<style type="text/css">@import url(\"https://assets.mlcdn.com/fonts.css?version=1749122\");</style>
<!-- Begin MailerLite Embed -->
<div id="mlb2-27227712" class="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-27227712">
  <div class="ml-form-align-center">
    <div class="ml-form-embedWrapper embedForm">
      <div class="ml-form-embedBody ml-form-embedBodyDefault row-form">
        <div class="ml-form-embedContent">
          <h4>Newsletter</h4>
          <p>Signup for news and special offers!</p>
        </div>
        <form class="ml-block-form" action="https://assets.mailerlite.com/jsonp/1595754/forms/157210520722605964/subscribe" method="post" target="_blank">
          <div class="ml-form-formContent">
            <div class="ml-form-fieldRow"><div class="ml-field-group ml-field-name ml-validate-required"><label>First Name</label><input aria-label="name" aria-required="true" type="text" class="form-control" name="fields[name]" autocomplete="given-name"></div></div>
            <div class="ml-form-fieldRow"><div class="ml-field-group ml-field-last_name"><label>Last Name</label><input aria-label="last_name" type="text" class="form-control" name="fields[last_name]" autocomplete="family-name"></div></div>
            <div class="ml-form-fieldRow"><div class="ml-field-group ml-field-email ml-validate-email ml-validate-required"><label>Email</label><input aria-label="email" aria-required="true" type="email" class="form-control" name="fields[email]" autocomplete="email"></div></div>
            <div class="ml-form-fieldRow"><div class="ml-field-group ml-field-phone"><label>Phone (optional)</label><input aria-label="phone" type="text" class="form-control" name="fields[phone]"></div></div>
            <div class="ml-form-fieldRow ml-last-item"><div class="ml-field-group ml-field-note ml-validate-required"><label>Comment</label><textarea class="form-control" name="fields[note]" aria-label="note" aria-required="true" maxlength="255"></textarea></div></div>
          </div>
          <input type="hidden" name="ml-submit" value="1">
          <div class="ml-form-embedSubmit"><button type="submit" class="primary">Subscribe</button></div>
          <input type="hidden" name="anticsrf" value="true">
        </form>
        <div class="ml-form-successBody row-success" style="display:none"><div class="ml-form-successContent"><h4>Thank you!</h4><p>You have successfully joined our subscriber list.</p></div></div>
      </div>
    </div>
  </div>
</div>
<script src="https://groot.mailerlite.com/js/w/webforms.min.js" type="text/javascript"></script>
<script>fetch(\"https://assets.mailerlite.com/jsonp/1595754/forms/157210520722605964/takel\")</script>
<!-- End MailerLite Embed -->`;

  return (
    <div className="w-full bg-gray-900/70 rounded-xl p-6 shadow-lg border border-purple-700/20">
      <div dangerouslySetInnerHTML={{ __html: embedHtml }} />
    </div>
  );
}
