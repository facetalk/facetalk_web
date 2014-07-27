package com.facehu.web.controller;

import com.facehu.web.dao.OrderDao;
import com.facehu.web.dao.ProductDao;
import com.facehu.web.dao.UserDao;
import com.facehu.web.model.Order;
import com.facehu.web.model.Product;
import com.facehu.web.model.User;
import com.facehu.web.service.BillService;
import com.facehu.web.util.CtlHelp;
import com.facehu.web.util.CtlHelp.CreateOrderResult;
import com.facehu.web.util.CtlHelp.OrderStatusResult;
import com.facehu.web.util.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;


/**
 * Created by wadang on 14-7-26.
 */
@Controller
@RequestMapping("/pay")
public class PayController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private OrderDao orderDao;

    @Autowired
    private BillService billService;


    @ResponseBody
    @RequestMapping(method = RequestMethod.POST, value = "/createOrder")
    public CreateOrderResult createOrder(@RequestParam("username") String username,
                                         @RequestParam("amount") String amount,
                                         @RequestParam("product") String product) {

        User user = userDao.getUserByName(username);

        int amountInt = 0;

        if (username == null
                || username.equalsIgnoreCase("")
                || product == null
                || product.equalsIgnoreCase("")
                || amount == null
                || amount.equalsIgnoreCase("")) {

            return new CreateOrderResult(CtlHelp.AjaxResult.resultState.failure,
                    "参数错误", "-1");
        }

        try {
            amountInt = Integer.valueOf(amount).intValue();
        } catch (Exception e) {

            e.printStackTrace();
            return new CreateOrderResult(CtlHelp.AjaxResult.resultState.failure,
                    "参数错误", "-1");
        }


        if (user == null) {
            return new CreateOrderResult(CtlHelp.AjaxResult.resultState.failure,
                    "用户不存在", "-1");
        }

        Product productObject = productDao.getProductByName(product);
        if (productObject == null) {
            return new CreateOrderResult(CtlHelp.AjaxResult.resultState.failure,
                    "产品不存在", "-1");

        }

        Order order = null;

        //避免生成过多的订单
        List<Order> orderList = orderDao.listOrdersByUserName(username, 0);

        if (orderList.size() > 0) {
            order = orderList.get(0);
        } else {

            order = new Order();
            order.setId(UUID.randomUUID().toString().replace("-", ""));
            order.setUsername(username);
        }

        order.setProductName(productObject.name);
        order.setProductDesc(productObject.getDesc());
        order.setProductAmount(amountInt);
        order.setTotalCost(amountInt * productObject.getPrice());
        order.setCreationTime(new Date());
        order.setOrderDesc("");

        orderDao.addOrder(order);

        return new CreateOrderResult(CtlHelp.AjaxResult.resultState.success,
                "成功", order.id);
    }


    @ResponseBody
    @RequestMapping(method = RequestMethod.GET, value = "/orderStatus/{orderId}")
    public OrderStatusResult orderStatus(@PathVariable String orderId) {
        int status = -1;
        String desc = "订单不存在";

        Order order = orderDao.getOrderById(orderId);

        if (order != null) {
            status = order.payStatus;
            desc = order.getPayStatusDesc();
        }

        return new OrderStatusResult(status, desc);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET, value = "/getOrder/{orderId}")
    public Order getOrder(@PathVariable String orderId) {
        return orderDao.getOrderById(orderId);

    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST, value = "/system/grant")
    public CtlHelp.AjaxResult systemGrant(@RequestParam("userName") String userName,
                                          @RequestParam("productName") String productName,
                                          @RequestParam("productAmount") int productAmount,
                                          @RequestParam("adminName") String adminName,
                                          @RequestParam("desc") String desc) {


        Logger.debug(this, "userName = [" + userName + "], productName = [" + productName + "], productAmount = [" + productAmount + "], adminName = [" + adminName + "], desc = [" + desc + "]");

        billService.systemGrant(userName, productName, productAmount, adminName, desc);

        return new CtlHelp.AjaxResult(CtlHelp.AjaxResult.resultState.success, "成功");
    }


}
