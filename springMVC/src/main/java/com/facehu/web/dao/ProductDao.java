package com.facehu.web.dao;

import com.facehu.web.model.Product;

/**
 * Created by wadang on 14-7-26.
 */
public interface ProductDao {

    public Product getProductByName(String name);

}
