# Colombo Market website — client handover guide

This guide is for running and making routine changes to the Colombo Market website without needing to be a developer. Keep it with the project and follow the steps in order the first time.

## What you need before you begin

- A computer (Mac, Windows, or Linux) with an internet connection.
- Access to the Colombo Market GitHub repository. Ask the developer to invite the GitHub account you intend to use as a **collaborator**.
- Access to the Colombo Market Shopify admin. Store-owner access is needed to create or install a custom app; otherwise, ask the store owner to do the Shopify credential step for you.
- The ChatGPT desktop app, signed in with the ChatGPT account that has access to Codex. If you do not see **Codex** in the app, contact OpenAI support or the person managing your ChatGPT plan.
- Node.js **20 or newer**. Download the LTS version from [nodejs.org](https://nodejs.org/) if it is not already installed.
- GitHub Desktop (recommended for non-developers), downloaded from [desktop.github.com](https://desktop.github.com/).

Do not send passwords, Shopify tokens, or the `.env.local` file by email, WhatsApp, or ChatGPT. These are the keys that let the website read from Shopify.

## Part 1 — download the website from GitHub

1. Open GitHub Desktop and sign in to the same GitHub account that has access to the repository.
2. Select **File → Clone repository**.
3. Choose the **URL** tab. In GitHub, open the website repository, select the green **Code** button, and copy the HTTPS URL. Paste it into GitHub Desktop.
4. Choose a simple location on your computer, such as `Documents/Colombo Market Website`, and select **Clone**.
5. When cloning finishes, select **Show in Finder** (Mac) or **Show in Explorer** (Windows). This folder is your local working copy.

Never work by editing files directly on the GitHub website. Keep a local copy and use GitHub Desktop to review and save each change.

## Part 2 — open the project in ChatGPT/Codex

1. Open the ChatGPT desktop app.
2. Start a new chat and choose **Codex** from the ChatGPT selector.
3. Choose **Open folder** (or create a local project and add a folder), then select the folder cloned in Part 1.
4. Use **Local** for simple, one-at-a-time website updates. Use **Worktree** only when you want a separate, isolated copy for a larger change.
5. In the new Codex chat, send this first message:

   ```text
   Read AGENTS.md and CLIENT_HANDOVER.md first. Explain the project in plain English. Do not change any files yet.
   ```

Codex can read and modify the selected local folder. Review every proposed change before accepting it.

## Part 3 — connect your local copy to Shopify (first time only)

The website does not contain Shopify secrets. You must create a local settings file on each computer that runs it.

1. In Shopify Admin, go to **Settings → Apps and sales channels → Develop apps**. Enable custom app development if Shopify asks you to.
2. Create an app named `Colombo Frontend (Headless)`.
3. Under **Configuration → Storefront API scopes**, enable at least:

   ```text
   unauthenticated_read_product_listings
   unauthenticated_read_product_inventory
   unauthenticated_read_collection_listings
   unauthenticated_read_metaobjects
   unauthenticated_read_content
   unauthenticated_read_checkouts
   unauthenticated_write_checkouts
   ```

4. Install the app. On its **API credentials** page, copy the **Storefront API access token**. Treat it as a password.
5. Find your store domain, for example `your-store.myshopify.com`, in the Shopify admin URL or under **Settings → Domains**.
6. In the website folder, make a copy of `.env.example` and name the copy `.env.local`.
7. Open `.env.local` in a plain-text editor and fill in the first three lines:

   ```text
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=paste_the_token_here
   SHOPIFY_STOREFRONT_API_VERSION=2025-10
   ```

8. Save the file. Leave the Customer Account lines blank until the customer login feature has been configured in Shopify.

Important: `.env.local` is deliberately excluded from GitHub. Never add it to a commit or paste its contents into a Codex prompt.

## Part 4 — start the website on your computer

1. In Codex, open the project terminal.
2. Run this once after cloning, or whenever the developer tells you that dependencies changed:

   ```bash
   npm install
   ```

3. Start the local website:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser. This is only visible on your computer. The German site is at `/`; English is at `/en`.
5. Check the Shopify connection at [http://localhost:3000/api/shopify-healthcheck](http://localhost:3000/api/shopify-healthcheck). A successful result contains `"ok": true`.
6. When you are finished, return to the terminal and press `Ctrl+C` to stop the local server.

If `npm` is not recognised, install Node.js from the requirements above and restart the ChatGPT app. If the health check says credentials are missing or invalid, re-check `.env.local` and the Storefront API token.

## Part 5 — make a safe change with Codex

Use this routine every time. One focused change per chat is easiest to review and undo.

1. In GitHub Desktop, select **Fetch origin**. If an update is available, select **Pull origin** before starting work.
2. Select **Current branch → New branch**, and name it clearly, for example `update-opening-hours` or `add-diwali-banner`.
3. Start a new Codex chat with the local project folder selected. Describe the outcome, not the technical solution. Example:

   ```text
   Read AGENTS.md and CLIENT_HANDOVER.md. Update the German and English contact-page opening hours to [new hours]. Do not change any other wording or styling. Show me a summary of the files changed and tell me how to check the result locally.
   ```

4. Ask Codex to run these checks after its change:

   ```text
   Run npm run lint and npx tsc --noEmit. Fix only issues caused by this change.
   ```

5. Run `npm run dev` and inspect the relevant page in your browser, in both German and English where applicable.
6. In GitHub Desktop, open the **Changes** tab. Read the changed-file list and the highlighted text. If anything looks unexpected, ask Codex to explain it before committing.
7. Write a short summary in GitHub Desktop, such as `Update contact opening hours`, then select **Commit to [branch]**.
8. Select **Push origin**. On GitHub, use **Create pull request** and ask the developer or another reviewer to check it before merging into `main`.

For a very small text correction you may merge your own pull request after checking it. For changes to checkout, customer accounts, product data, payments, domain settings, or Shopify API settings, ask the developer to review first.

## Where common changes belong

- **Product name, price, photo, stock, category or collection:** Shopify Admin — not the website code.
- **Website text in German or English:** `messages/de.json` and `messages/en.json`. Ask Codex to update the matching text in both files.
- **Address, social links, free-delivery threshold, or site name:** `config/site.ts`.
- **Which Shopify collection appears in a homepage section:** `config/collections.ts`.
- **Brand colours, fonts, spacing, or design:** ask Codex; it must keep `config/theme.ts` and `app/globals.css` in sync.
- **Homepage banner image:** Shopify’s `home_banners` metaobject. Ask the developer if you do not have access to it.
- **A new page, feature, layout change, or integration:** ask Codex to make a plan first, then have a developer review the pull request.

The storefront reads products and collection data from Shopify. Editing a product in Shopify is normally the quickest and safest way to update what customers see.

## Useful prompts to copy into Codex

### Ask before changing anything

```text
Read AGENTS.md and CLIENT_HANDOVER.md. I want to [describe the change]. First explain which files and customer-facing pages this affects. Do not make changes yet.
```

### Make a content change

```text
Read AGENTS.md and CLIENT_HANDOVER.md. Update [exact text or business fact] in German and English. Preserve all other text, layout, and behaviour. Run the project checks and give me a short review checklist.
```

### Investigate a problem

```text
Read AGENTS.md and CLIENT_HANDOVER.md. On [page URL], [describe what is wrong and what you expected]. Investigate and explain the likely cause. Do not change files until I approve the proposed fix.
```

### Check work before committing

```text
Review the current uncommitted changes. Confirm they only do [intended outcome], list any risks, and run npm run lint plus npx tsc --noEmit. Do not make unrelated changes.
```

## Before a change goes live

- Confirm that it looks correct at `http://localhost:3000`.
- Check both German (`/`) and English (`/en`) for any text or navigation change.
- Confirm product, cart, and checkout links still work when the change touches those areas.
- Make sure `.env.local` does not appear in GitHub Desktop’s **Changes** list.
- Commit to a branch, push it, and merge a reviewed pull request.
- Deploy using the hosting provider’s normal workflow. This repository does not include hosting configuration, so confirm the deployment process and production environment variables with the developer before the first live release.

## Getting help

When asking for help, include the page address, what you clicked, what you expected, and a screenshot of the error (without showing credentials). Tell the developer whether the problem happens locally, on the live website, or both.

For ChatGPT/Codex guidance, use the official [ChatGPT Projects documentation](https://learn.chatgpt.com/docs/projects) and [Codex environments documentation](https://learn.chatgpt.com/docs/environments/modes).
