package com.facehu.web.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by wadang on 14-7-15.
 */

public class CtlHelp {

    /**
     * 邮箱验证
     *
     * @param email
     * @return
     */
    public static boolean emailCheck(String email) {
        String check = "^([a-z0-9A-Z]+[-|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$";
        Pattern regex = Pattern.compile(check);
        Matcher matcher = regex.matcher(email);
        return matcher.matches();
    }


    static public void writePicToFile(String picDate, String fileName) throws IOException {
        File file = new File(fileName);

        FileOutputStream fop = new FileOutputStream(file);
        if (!file.exists()) {
            file.createNewFile();
        }

        byte[] contentInBytes = picDate.getBytes();
        fop.write(contentInBytes);
        fop.flush();
        fop.close();

    }


}
