/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.twc.wms.controller;

import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author wien
 */
public class HelloController extends HttpServlet {

  private static final long serialVersionUID = 4707490878358448870L;
  private static final String PAGE_VIEW = "../views/tmpl.jsp";

  public HelloController() {
  }

  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    request.setAttribute("PROGRAMNAME", "HI");
    String forward = "";
    try {
      String action = request.getParameter("action");
      if (action == null) {
        forward = PAGE_VIEW;
        request.setAttribute("PROGRAMDESC", "HELLO CONTROLLER");
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    RequestDispatcher view = request.getRequestDispatcher(forward);
    view.forward(request, response);
  }

  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    String action = "";
    response.sendRedirect("/WMSTemplate/hello/tmpl");
  }

}
