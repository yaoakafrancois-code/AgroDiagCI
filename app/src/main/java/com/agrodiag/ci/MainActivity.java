package com.agrodiag.ci;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.webkit.GeolocationPermissions;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.webkit.WebViewAssetLoader;

import java.io.OutputStream;

/**
 * AgroDiag CI : l'application tourne entièrement hors connexion.
 * La page (assets/index.html) est servie depuis l'APK via WebViewAssetLoader,
 * les données sont gardées dans le stockage local de la WebView (sur le téléphone).
 */
public class MainActivity extends Activity {

    private static final String HOST = "appassets.androidplatform.net";
    private static final String DATA_HOST = "yaoakafrancois-code.github.io";
    private static final String START_URL = "https://" + HOST + "/assets/index.html";
    private static final int REQ_FILE_CHOOSER = 1;
    private static final int REQ_CREATE_FILE = 2;
    private static final int REQ_LOCATION = 3;
    private String geoOrigin;
    private GeolocationPermissions.Callback geoCallback;
    private WebView printView;

    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private byte[] pendingBytes;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(0xFF1D6A4A);
        webView = new WebView(this);
        webView.setBackgroundColor(0xFFF3F5F1);
        root.addView(webView, new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        setContentView(root);
        applySystemBarInsets(root);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // localStorage : fiches, coûts, villages, climat
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportMultipleWindows(false);
        s.setTextZoom(100);
        s.setGeolocationEnabled(true);   // délimitation des parcelles au GPS

        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                if (HOST.equals(url.getHost())) return assetLoader.shouldInterceptRequest(url);
                // Seule exception : le fichier de données publié par l'administrateur (mise à jour des données)
                if (DATA_HOST.equals(url.getHost()) && url.getPath() != null && url.getPath().startsWith("/AgroDiagCI/data/")) return null;
                // Aucune autre ressource externe n'est chargée dans l'app
                return new WebResourceResponse("text/plain", "utf-8", null);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                if (HOST.equals(url.getHost())) return false;
                // Liens externes (NASA POWER, sources) : ouverts dans le navigateur du téléphone
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, url));
                } catch (ActivityNotFoundException e) {
                    Toast.makeText(MainActivity.this, "Aucun navigateur pour ouvrir ce lien", Toast.LENGTH_SHORT).show();
                }
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    callback.invoke(origin, true, false);
                } else {
                    geoOrigin = origin;
                    geoCallback = callback;
                    requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, REQ_LOCATION);
                }
            }

            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (filePathCallback != null) filePathCallback.onReceiveValue(null);
                filePathCallback = callback;
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                try {
                    startActivityForResult(Intent.createChooser(intent, "Choisir un fichier"), REQ_FILE_CHOOSER);
                } catch (ActivityNotFoundException e) {
                    filePathCallback = null;
                    return false;
                }
                return true;
            }
        });

        webView.addJavascriptInterface(new Bridge(), "AgroDiagAndroid");

        if (savedInstanceState != null) webView.restoreState(savedInstanceState);
        else webView.loadUrl(START_URL);
    }

    /** Pont appelé par la page pour enregistrer un export (CSV, sauvegarde JSON). */
    private class Bridge {
        @JavascriptInterface
        public void saveFile(final String name, final String mime, final String base64) {
            runOnUiThread(() -> {
                try {
                    pendingBytes = Base64.decode(base64, Base64.DEFAULT);
                } catch (IllegalArgumentException e) {
                    notifyPage("error");
                    return;
                }
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType(mime == null || mime.isEmpty() ? "application/octet-stream" : mime);
                intent.putExtra(Intent.EXTRA_TITLE, name);
                try {
                    startActivityForResult(intent, REQ_CREATE_FILE);
                } catch (ActivityNotFoundException e) {
                    pendingBytes = null;
                    notifyPage("error");
                }
            });
        }

        /** Impression ou enregistrement en PDF d'une fiche (HTML complet). */
        @JavascriptInterface
        public void printHtml(final String html, final String jobName) {
            runOnUiThread(() -> {
                printView = new WebView(MainActivity.this);
                printView.setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        PrintManager pm = (PrintManager) getSystemService(PRINT_SERVICE);
                        String name = (jobName == null || jobName.isEmpty()) ? "AgroDiag CI" : jobName;
                        pm.print(name, view.createPrintDocumentAdapter(name), new PrintAttributes.Builder().build());
                    }
                });
                printView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
            });
        }

        @JavascriptInterface
        public String platform() {
            return "android";
        }
    }

    private void notifyPage(String status) {
        webView.evaluateJavascript("window.__agrodiagSaved && window.__agrodiagSaved('" + status + "')", null);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_FILE_CHOOSER) {
            if (filePathCallback != null) {
                Uri[] result = null;
                if (resultCode == RESULT_OK && data != null && data.getData() != null) {
                    result = new Uri[]{data.getData()};
                }
                filePathCallback.onReceiveValue(result);
                filePathCallback = null;
            }
        } else if (requestCode == REQ_CREATE_FILE) {
            if (resultCode != RESULT_OK || data == null || data.getData() == null || pendingBytes == null) {
                pendingBytes = null;
                notifyPage("declined");
                return;
            }
            try (OutputStream out = getContentResolver().openOutputStream(data.getData())) {
                if (out == null) throw new java.io.IOException("flux indisponible");
                out.write(pendingBytes);
                notifyPage("ok");
                Toast.makeText(this, "Fichier enregistré", Toast.LENGTH_SHORT).show();
            } catch (Exception e) {
                notifyPage("error");
                Toast.makeText(this, "Enregistrement impossible", Toast.LENGTH_SHORT).show();
            } finally {
                pendingBytes = null;
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_LOCATION && geoCallback != null) {
            boolean ok = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            if (!ok && grantResults.length > 1) ok = grantResults[1] == PackageManager.PERMISSION_GRANTED;
            geoCallback.invoke(geoOrigin, ok, false);
            geoCallback = null;
            geoOrigin = null;
        }
    }

    /** Android 15+ affiche l'app bord à bord : on garde le contenu hors des barres système. */
    private void applySystemBarInsets(View v) {
        v.setOnApplyWindowInsetsListener((view, insets) -> {
            int l, t, r, b;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                Insets i = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                l = i.left; t = i.top; r = i.right; b = i.bottom;
            } else {
                l = insets.getSystemWindowInsetLeft(); t = insets.getSystemWindowInsetTop();
                r = insets.getSystemWindowInsetRight(); b = insets.getSystemWindowInsetBottom();
            }
            view.setPadding(l, t, r, b);
            return insets;
        });
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    protected void onDestroy() {
        if (webView != null) webView.destroy();
        super.onDestroy();
    }
}
