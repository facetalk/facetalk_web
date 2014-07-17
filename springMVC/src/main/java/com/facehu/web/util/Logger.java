package com.facehu.web.util;

import org.apache.log4j.Level;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by wadang on 14-7-15.
 * <p/>
 * 日志处理
 */

public class Logger {

    private static Map<Class, org.apache.log4j.Logger> map = new HashMap<Class, org.apache.log4j.Logger>();


    /**
     * This class is syncrozned.  It shouldn't be called. It is exposed so that
     *
     * @param cl
     * @return
     */
    private synchronized static org.apache.log4j.Logger loadLogger(Class cl) {
        if (map.get(cl) == null) {
            org.apache.log4j.Logger logger = org.apache.log4j.Logger.getLogger(cl);
            map.put(cl, logger);
        }
        return map.get(cl);
    }

    public static void info(Object ob, String message) {
        Class cl = ob.getClass();
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.info(message);
    }

    public static void info(Class cl, String message) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.info(message);
    }

    public static void debug(Object ob, String message) {
        Class cl = ob.getClass();
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.debug(message);
    }

    public static void debug(Object ob, String message, Throwable ex) {
        Class cl = ob.getClass();
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.debug(message, ex);
    }

    public static void debug(Class cl, String message) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.debug(message);
    }

    public static void debug(Class cl, String message, Throwable ex) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.debug(message, ex);
    }

    public static void error(Object ob, String message) {
        Class cl = ob.getClass();
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.error(message);
    }

    public static void error(Object ob, String message, Throwable ex) {
        Class cl = ob.getClass();
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }

        logger.error(message, ex);
    }

    public static void error(Class cl, String message) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.error(message);
    }

    public static void error(Class cl, String message, Throwable ex) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.error(message, ex);
    }

    public static void fatal(Object ob, String message) {
        Class cl = ob.getClass();
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }

        logger.fatal(message);
    }

    public static void fatal(Object ob, String message, Throwable ex) {
        Class cl = ob.getClass();
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.fatal(message, ex);
    }

    public static void fatal(Class cl, String message) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.fatal(message);
    }

    public static void fatal(Class cl, String message, Throwable ex) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.fatal(message, ex);
    }

    public static void warn(Object ob, String message) {
        Class cl = ob.getClass();
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.warn(message);
    }

    public static void warn(Object ob, String message, Throwable ex) {
        Class cl = ob.getClass();
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.warn(message, ex);
    }

    public static void warn(Class cl, String message) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.warn(message);
    }

    public static void warn(Class cl, String message, Throwable ex) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        logger.warn(message, ex);
    }

    public static boolean isDebugEnabled(Class cl) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        return logger.isEnabledFor(Level.DEBUG);
        //    	return false;
    }

    public static boolean isInfoEnabled(Class cl) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        return logger.isEnabledFor(Level.INFO);
        //    	return false;
    }

    public static boolean isWarnEnabled(Class cl) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        return logger.isEnabledFor(Level.WARN);
        //    	return false;
    }

    public static boolean isErrorEnabled(Class cl) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        return logger.isEnabledFor(Level.ERROR);
        //    	return false;
    }

    public static org.apache.log4j.Logger getLogger(Class cl) {
        org.apache.log4j.Logger logger = map.get(cl);
        if (logger == null) {
            logger = loadLogger(cl);
        }
        return logger;
    }

}
