from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_styled_email(subject, to_email, html_content):
    text_content = html_content.replace("<br>", "\n").replace("</p>", "\n")
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@shared_task
def send_welcome_email(user_id):
    from accounts.models import User

    try:
        user = User.objects.get(id=user_id)
        name = user.first_name or user.username

        html = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ResumeAI</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d17;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d17;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:12px;padding:10px 16px;">
                    <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.5px;">🧠 ResumeAI</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#1e1e2e;border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

              <!-- Hero gradient bar -->
              <tr>
                <td style="background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);height:4px;"></td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:40px;">

                  <!-- Emoji -->
                  <p style="font-size:48px;margin:0 0 24px;text-align:center;">👋</p>

                  <!-- Title -->
                  <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0 0 8px;text-align:center;">
                    Welcome, {name}!
                  </h1>
                  <p style="color:rgba(255,255,255,0.4);font-size:15px;text-align:center;margin:0 0 32px;">
                    Your ResumeAI account is ready
                  </p>

                  <!-- Divider -->
                  <div style="border-top:1px solid rgba(255,255,255,0.08);margin-bottom:32px;"></div>

                  <!-- Body text -->
                  <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 24px;">
                    We're excited to have you on board! ResumeAI uses the power of
                    <strong style="color:#a855f7;">Google Gemini AI</strong> to analyze your resume
                    and give you actionable insights to land your dream job.
                  </p>

                  <!-- Features -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                    <tr>
                      <td style="padding:12px;background:rgba(99,102,241,0.1);border-radius:12px;border:1px solid rgba(99,102,241,0.2);margin-bottom:8px;">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="width:32px;font-size:20px;">📊</td>
                            <td style="padding-left:12px;">
                              <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0;">AI Score Analysis</p>
                              <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:2px 0 0;">Get a detailed score across 6 dimensions</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr><td style="height:8px;"></td></tr>
                    <tr>
                      <td style="padding:12px;background:rgba(168,85,247,0.1);border-radius:12px;border:1px solid rgba(168,85,247,0.2);">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="width:32px;font-size:20px;">✍️</td>
                            <td style="padding-left:12px;">
                              <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0;">Cover Letter Generator</p>
                              <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:2px 0 0;">AI-written cover letter in seconds</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr><td style="height:8px;"></td></tr>
                    <tr>
                      <td style="padding:12px;background:rgba(236,72,153,0.1);border-radius:12px;border:1px solid rgba(236,72,153,0.2);">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="width:32px;font-size:20px;">🎤</td>
                            <td style="padding-left:12px;">
                              <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0;">Interview Preparation</p>
                              <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:2px 0 0;">10 personalized interview questions</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="http://localhost:5173/analyze"
                           style="display:inline-block;background:linear-gradient(135deg,#6366f1,#a855f7);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                          🚀 Analyze my resume now
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer inside card -->
              <tr>
                <td style="padding:20px 40px;background:rgba(0,0,0,0.2);border-top:1px solid rgba(255,255,255,0.05);">
                  <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;text-align:center;">
                    You're receiving this because you just created an account on ResumeAI.<br>
                    © 2026 ResumeAI · Built by Souhail HMAHMA
                  </p>
                </td>
              </tr>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
        send_styled_email(
            subject="👋 Welcome to ResumeAI — Let's analyze your resume!",
            to_email=user.email,
            html_content=html,
        )
        return f"Welcome email sent to {user.email}"
    except Exception as e:
        logger.error(f"Welcome email error: {e}", exc_info=True)


@shared_task
def send_analysis_complete_email(resume_id):
    from resumes.models import Resume

    try:
        resume = Resume.objects.get(id=resume_id)
        score = resume.analysis.overall_score if hasattr(resume, "analysis") else None
        name = resume.user.first_name or resume.user.username

        # Score config
        if score and score >= 85:
            score_emoji = "🎉"
            score_color = "#22c55e"
            score_label = "Excellent!"
            score_msg = "Outstanding resume! You're well positioned for your job search."
            gradient = "linear-gradient(135deg,#22c55e,#16a34a)"
        elif score and score >= 70:
            score_emoji = "👍"
            score_color = "#6366f1"
            score_label = "Good"
            score_msg = "Solid resume! A few improvements could make it even stronger."
            gradient = "linear-gradient(135deg,#6366f1,#a855f7)"
        elif score and score >= 50:
            score_emoji = "📈"
            score_color = "#f59e0b"
            score_label = "Average"
            score_msg = "Room for improvement. Check our suggestions to boost your score."
            gradient = "linear-gradient(135deg,#f59e0b,#ef4444)"
        else:
            score_emoji = "💪"
            score_color = "#ef4444"
            score_label = "Needs work"
            score_msg = "Don't worry! Follow our suggestions to significantly improve your resume."
            gradient = "linear-gradient(135deg,#ef4444,#dc2626)"

        html = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0d0d17;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d17;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:12px;padding:10px 16px;">
                    <span style="color:#ffffff;font-size:18px;font-weight:700;">🧠 ResumeAI</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#1e1e2e;border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

              <!-- Hero gradient bar -->
              <tr>
                <td style="background:{gradient};height:4px;"></td>
              </tr>

              <!-- Score hero section -->
              <tr>
                <td style="background:linear-gradient(180deg,rgba(99,102,241,0.1) 0%,transparent 100%);padding:40px;text-align:center;">
                  <p style="font-size:56px;margin:0 0 8px;">{score_emoji}</p>
                  <p style="color:rgba(255,255,255,0.5);font-size:13px;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">
                    Analysis complete
                  </p>
                  <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 24px;">
                    Your resume has been analyzed, {name}!
                  </h1>

                  <!-- Score circle -->
                  <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:16px;">
                    <tr>
                      <td style="background:{gradient};border-radius:50%;padding:3px;">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background:#1e1e2e;border-radius:50%;width:110px;height:110px;text-align:center;vertical-align:middle;">
                              <p style="color:{score_color};font-size:36px;font-weight:800;margin:0;">{score}%</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="color:{score_color};font-size:18px;font-weight:700;margin:0 0 8px;">{score_label}</p>
                  <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0;">{score_msg}</p>
                </td>
              </tr>

              <!-- Resume info -->
              <tr>
                <td style="padding:0 40px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0"
                         style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;">
                    <tr>
                      <td>
                        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.5px;">
                          Resume analyzed
                        </p>
                        <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0;">
                          📄 {resume.filename}
                        </p>
                        {'<p style="color:rgba(255,255,255,0.4);font-size:13px;margin:4px 0 0;">🎯 ' + resume.job_title + '</p>' if resume.job_title else ''}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- What's next -->
              <tr>
                <td style="padding:0 40px 32px;">
                  <p style="color:rgba(255,255,255,0.6);font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px;">
                    What's next
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:10px 12px;background:rgba(99,102,241,0.08);border-left:3px solid #6366f1;border-radius:0 8px 8px 0;margin-bottom:8px;">
                        <p style="color:#a5b4fc;font-size:13px;margin:0;">
                          📋 Read your <strong>personalized suggestions</strong>
                        </p>
                      </td>
                    </tr>
                    <tr><td style="height:6px;"></td></tr>
                    <tr>
                      <td style="padding:10px 12px;background:rgba(168,85,247,0.08);border-left:3px solid #a855f7;border-radius:0 8px 8px 0;">
                        <p style="color:#d8b4fe;font-size:13px;margin:0;">
                          ✍️ Generate your <strong>cover letter</strong>
                        </p>
                      </td>
                    </tr>
                    <tr><td style="height:6px;"></td></tr>
                    <tr>
                      <td style="padding:10px 12px;background:rgba(236,72,153,0.08);border-left:3px solid #ec4899;border-radius:0 8px 8px 0;">
                        <p style="color:#f9a8d4;font-size:13px;margin:0;">
                          🎤 Practice with <strong>interview questions</strong>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding:0 40px 40px;" align="center">
                  <a href="http://localhost:5173/results/{resume.id}"
                     style="display:inline-block;background:{gradient};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600;">
                    View full analysis →
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 40px;background:rgba(0,0,0,0.2);border-top:1px solid rgba(255,255,255,0.05);">
                  <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;text-align:center;">
                    © 2026 ResumeAI · Built by Souhail HMAHMA
                  </p>
                </td>
              </tr>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
        send_styled_email(
            subject=f"{score_emoji} Your resume score is {score}% — View your analysis",
            to_email=resume.user.email,
            html_content=html,
        )
        return f"Analysis email sent to {resume.user.email}"
    except Exception as e:
        logger.error(f"Analysis email error: {e}", exc_info=True)
