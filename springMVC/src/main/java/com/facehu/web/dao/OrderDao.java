package com.facehu.web.dao;

import com.facehu.web.model.Order;

import java.util.List;

/**
 * Created by wadang on 14-7-26.
 */

public interface OrderDao {

    public void addOrder(Order order);

    public void updateOrder(Order order);

    public List<Order> listOrdersByUserName(String userName);

    public List<Order> listOrdersByUserName(String userName, int firstResult, int maxResult);

    public List<Order> listOrdersByUserName(String userName, int payStatus);

    public List<Order> listOrdersByUserName(String userName, int payStatus, int firstResult, int maxResult);

    public Order getOrderById(String Id);

}
