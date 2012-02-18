package jenkins.plugins.ezwall;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.ClassRule;
import org.junit.Test;
import org.jvnet.hudson.test.JenkinsRule;

import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class EzWallViewActionTest {

	@ClassRule
	public static JenkinsRule jRule = new JenkinsRule();
	
	@Test
	public void test_view_button_presence() throws Exception {
		HtmlPage page = jRule.createWebClient().goTo("");
		HtmlElement tasks = page.getElementById("tasks");
		assertThat(tasks.selectNodes(".//a[@href='/ezwall']").size()).isGreaterThan(0);

	}

	@Test
	public void test_wall_presence() throws Exception {
		assertThat(jRule.createWebClient().goTo("ezwall")).isNotNull();
	}

	@Test
	public void test_descriptor_presence() {
		assertThat(jRule.jenkins.getDescriptorOrDie(EzWallViewAction.class)).isNotNull();
	}

	@Test
	public void test_plugin_shortname() {
		assertThat(jRule.jenkins.getPlugin(EzWallViewAction.SHORT_NAME)).isNotNull();
	}
}
