/*
 * The MIT License
 * 
 * Copyright (c) 2012, Axel Haustant
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package jenkins.plugins.ezwall;

import hudson.Extension;
import hudson.model.Action;
import hudson.model.Describable;
import hudson.model.Api;
import hudson.model.Descriptor;
import jenkins.model.Jenkins;
import net.sf.json.JSONObject;

import org.kohsuke.stapler.StaplerRequest;
import org.kohsuke.stapler.export.Exported;
import org.kohsuke.stapler.export.ExportedBean;

/**
 * Display the EzWall action on each view.
 * 
 * @author Axel Haustant
 */
@ExportedBean
public class EzWallViewAction implements Action, Describable<EzWallViewAction> {

	public Api getApi() {
		return new Api(this);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see hudson.model.Action#getDisplayName()
	 */
	public String getDisplayName() {
		return "EzWall";
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see hudson.model.Action#getIconFileName()
	 */
	public String getIconFileName() {
		return "monitor.png";
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see hudson.model.Action#getUrlName()
	 */
	public String getUrlName() {
		return "ezwall";
	}

	@Exported
	public int getPollInterval() {
		return getDescriptor().getPollInterval();
	}

	public EzWallViewActionDescriptor getDescriptor() {
		return EzWallViewActionDescriptor.class.cast(Jenkins.getInstance().getDescriptorOrDie(getClass()));
	}

	@Extension
	public static final class EzWallViewActionDescriptor extends Descriptor<EzWallViewAction> {

		private int pollInterval = 5;

		@Override
		public String getDisplayName() {
			return "EzWall";
		}

		@Override
		public boolean configure(StaplerRequest req, JSONObject json) throws FormException {
			req.bindJSON(this, json.getJSONObject("ezwall"));
			save();
			return true;
		}

		public int getPollInterval() {
			return pollInterval;
		}

		public void setPollInterval(int pollInterval) {
			this.pollInterval = pollInterval;
		}

	}

}
