package com.facehu.web.controller;

import com.facehu.web.util.CtlHelp;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.io.IOException;

/**
 * Created by wadang on 14-8-23.
 */
@Controller
@RequestMapping("/facesms")
public class FaceSmsController {


    @Value("${faceSmsGifPath}")
    private String faceSmsGifPath;

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST, value = "/saveGif")
    public CtlHelp.AjaxResult saveGif(@RequestParam("picData") String picData, @RequestParam("gifId") String gifId) {


        String savefileName = new StringBuilder().append(faceSmsGifPath).append(File.separator)
                .append(gifId.substring(0, 2)).append(File.separator)
                .append(gifId.substring(2, 4)).append(File.separator)
                .append(gifId).append(".gif").toString();
        try {

            CtlHelp.writePicToFile(picData.substring(22), savefileName);
            return new CtlHelp.AjaxResult(CtlHelp.AjaxResult.resultState.success, "成功");
        } catch (IOException e) {
            e.printStackTrace();
            return new CtlHelp.AjaxResult(CtlHelp.AjaxResult.resultState.failure, "失败" + e.getMessage());
        }

    }

}
