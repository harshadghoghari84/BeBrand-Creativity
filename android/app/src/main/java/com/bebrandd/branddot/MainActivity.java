package com.bebrandd.branddot;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.view.WindowManager;
// import expo.modules.splashscreen.singletons.SplashScreen;
// import expo.modules.splashscreen.SplashScreenImageResizeMode;

import androidx.annotation.Nullable;
import android.content.IntentSender;
import android.util.Log;
import android.widget.Toast;

import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.UpdateAvailability;
import com.google.android.play.core.tasks.OnSuccessListener;
import com.google.android.play.core.tasks.Task;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
    private int REQUEST_CODE = 11;
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // SplashScreen.show(...) has to be called after super.onCreate(...)
    // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually
//    SplashScreen.show(this, SplashScreenImageResizeMode.COVER, false);
//    SplashScreen.show(this, SplashScreenImageResizeMode.COVER, ReactRootView.class, false);
        SplashScreen.show(this, R.style.SplashScreenTheme);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);

//      AppUpdateManager appUpdateManager = AppUpdateManagerFactory.create(MainActivity.this);
//      Task<AppUpdateInfo> appUpdateInfoTask = appUpdateManager.getAppUpdateInfo();
//
//
//      appUpdateInfoTask.addOnSuccessListener(new OnSuccessListener<AppUpdateInfo>() {
//          @Override
//          public void onSuccess(AppUpdateInfo result) {
//              if(result.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE &&
//                      result.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)){
//                  try {
//                      appUpdateManager.startUpdateFlowForResult(
//                              result,AppUpdateType.IMMEDIATE,MainActivity.this,REQUEST_CODE);
//                  } catch (IntentSender.SendIntentException e) {
//                      e.printStackTrace();
//                  }
//              }
//          }
//      });
  }



    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */

//    @Override
//    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
//        super.onActivityResult(requestCode, resultCode, data);
//        if(requestCode == REQUEST_CODE){
//            // Toast.makeText(this,"Start Download",Toast.LENGTH_SHORT).show();
//            if(resultCode != RESULT_OK){
//                Log.d("mmm","Update flow failed"+resultCode);
//            }
//        }
//    }
    @Override
    protected String getMainComponentName() {
        return "main";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }

        };
    }
}
